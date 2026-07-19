import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 300;

const TIMEOUT_MS = 295_000;

function resolveWebhookUrl(req: NextRequest): string | null {
  const fromHeader = req.headers.get('x-n8n-webhook-url');
  if (fromHeader && fromHeader.trim()) return fromHeader.trim();

  const envUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL;
  if (envUrl && envUrl.trim()) return envUrl.trim();

  return null;
}

function toTestUrl(url: string): string {
  if (url.includes('/webhook-test/')) return url;
  return url.replace('/webhook/', '/webhook-test/');
}

function toProdUrl(url: string): string {
  if (url.includes('/webhook/')) return url;
  return url.replace('/webhook-test/', '/webhook/');
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseResponseBody(contentType: string, text: string): unknown {
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  return text;
}

export async function POST(req: NextRequest) {
  const webhookUrl = resolveWebhookUrl(req);

  if (!webhookUrl) {
    return NextResponse.json(
      {
        type: 'not_configured',
        message: "We couldn't find your n8n workflow. Please configure your webhook URL in Settings.",
      },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { type: 'validation', message: 'Invalid JSON payload.' },
      { status: 400 },
    );
  }

  const payloadStr = JSON.stringify(body);
  const fetchInit: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payloadStr,
  };

  // Try the configured URL first, then fall back to the alternate path.
  // n8n uses /webhook/ for active workflows and /webhook-test/ for inactive ones.
  const primaryUrl = webhookUrl;
  const fallbackUrl = webhookUrl.includes('/webhook-test/')
    ? toProdUrl(webhookUrl)
    : toTestUrl(webhookUrl);

  for (let attempt = 0; attempt < 2; attempt++) {
    const targetUrl = attempt === 0 ? primaryUrl : fallbackUrl;
    if (!targetUrl) continue;

    try {
      const res = await fetchWithTimeout(targetUrl, fetchInit, TIMEOUT_MS);
      const contentType = res.headers.get('content-type') || '';
      const text = await res.text();

      // If we get 404 on the first attempt, try the fallback URL
      if (res.status === 404 && attempt === 0) {
        continue;
      }

      if (!res.ok) {
        const errorData = parseResponseBody(contentType, text);
        const hint =
          res.status === 404
            ? ' The webhook URL was not found. Make sure your workflow is active in n8n (or listening on the test URL), and that the webhook path is correct.'
            : '';
        return NextResponse.json(
          {
            type: 'workflow',
            message: `The workflow returned an error (HTTP ${res.status}).${hint}`,
            statusCode: res.status,
            details: errorData,
          },
          { status: res.status },
        );
      }

      // Success
      const json = parseResponseBody(contentType, text);
      return NextResponse.json(json);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return NextResponse.json(
          {
            type: 'timeout',
            message: 'The request timed out. The workflow may still be running — check History for results.',
          },
          { status: 504 },
        );
      }

      // Network error on first attempt — try fallback before giving up
      if (attempt === 0) {
        continue;
      }

      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      return NextResponse.json(
        {
          type: 'network',
          message: `Unable to reach the n8n webhook. ${message}`,
        },
        { status: 502 },
      );
    }
  }

  // Both URLs returned 404
  return NextResponse.json(
    {
      type: 'workflow',
      message:
        'The n8n webhook was not found (HTTP 404). Check that your workflow is Active in n8n, and that the webhook URL is correct. In n8n: open your workflow → click the Form Trigger node → copy the Production URL (for active workflows) or Test URL (for inactive workflows).',
      statusCode: 404,
    },
    { status: 404 },
  );
}

export async function GET(req: NextRequest) {
  const webhookUrl = resolveWebhookUrl(req);

  if (!webhookUrl) {
    return NextResponse.json(
      { connected: false, message: 'No webhook URL configured.' },
      { status: 400 },
    );
  }

  // Try both URL variants for the health check
  const urls = [
    webhookUrl,
    webhookUrl.includes('/webhook-test/') ? toProdUrl(webhookUrl) : toTestUrl(webhookUrl),
  ];

  for (let i = 0; i < urls.length; i++) {
    try {
      const res = await fetchWithTimeout(urls[i], { method: 'GET' }, 10_000);
      // Any HTTP response means n8n is reachable
      return NextResponse.json({
        connected: true,
        message: 'Connected',
        statusCode: res.status,
      });
    } catch {
      if (i === 0) continue;
      const message = 'Unable to reach n8n. Verify the URL and that your n8n instance is running.';
      return NextResponse.json(
        { connected: false, message },
        { status: 502 },
      );
    }
  }

  return NextResponse.json(
    { connected: false, message: 'Unable to reach n8n.' },
    { status: 502 },
  );
}

export async function OPTIONS() {
  return NextResponse.json(
    { connected: true, message: 'Proxy available' },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-n8n-webhook-url',
      },
    },
  );
}
