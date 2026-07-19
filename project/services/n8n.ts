import axios, { AxiosError } from 'axios';
import type { GenerationFormValues } from '@/types';
import { resolveWebhookUrl } from '@/config/api';

const PROXY_URL = '/api/n8n';

export interface N8nError {
  type: 'network' | 'timeout' | 'workflow' | 'validation' | 'not_configured' | 'unknown';
  message: string;
  statusCode?: number;
  details?: unknown;
}

export interface N8nHealthResult {
  connected: boolean;
  message: string;
  statusCode?: number;
}

export function getWebhookUrl(override?: string): string {
  return resolveWebhookUrl(override);
}

export function parseN8nError(err: unknown): N8nError {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError;
    if (ax.code === 'ECONNABORTED') {
      return {
        type: 'timeout',
        message: 'The request timed out. The workflow may still be running — check History for results.',
      };
    }

    const status = ax.response?.status;
    const data = ax.response?.data as Record<string, unknown> | undefined;

    // The proxy returns structured error objects
    if (data && typeof data === 'object') {
      const proxyType = data.type as string | undefined;
      const proxyMessage = data.message as string | undefined;
      if (proxyType === 'not_configured') {
        return {
          type: 'not_configured',
          message: proxyMessage || "We couldn't find your n8n workflow. Please configure your webhook URL in Settings.",
        };
      }
      if (proxyType === 'timeout') {
        return { type: 'timeout', message: proxyMessage || 'The request timed out.' };
      }
      if (proxyType === 'network') {
        return { type: 'network', message: proxyMessage || 'Unable to reach the n8n webhook.' };
      }
      if (proxyType === 'workflow') {
        return { type: 'workflow', message: proxyMessage || `Workflow error (HTTP ${status}).`, statusCode: status, details: data.details };
      }
      if (proxyMessage) {
        return { type: 'workflow', message: proxyMessage, statusCode: status, details: data.details };
      }
    }

    if (!ax.response) {
      return {
        type: 'network',
        message: 'Unable to reach the n8n webhook. Verify the URL and that your n8n instance is running.',
      };
    }

    return {
      type: 'workflow',
      message: `The workflow returned an error (HTTP ${status}).`,
      statusCode: status,
      details: data,
    };
  }

  if (err instanceof Error) {
    return { type: 'unknown', message: err.message };
  }

  return { type: 'unknown', message: 'An unexpected error occurred.' };
}

const TIMEOUT_MS = 300_000;
const MAX_RETRIES = 2;

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (axios.isAxiosError(err)) {
        const ax = err as AxiosError;
        // Only retry on 5xx from the proxy (n8n server errors)
        if (ax.response && ax.response.status >= 500 && attempt < retries) {
          continue;
        }
      }
      throw err;
    }
  }
  throw lastErr;
}

/**
 * Health check via the server-side proxy.
 * Any HTTP response from the proxy means n8n is reachable.
 */
export async function healthCheck(urlOverride?: string): Promise<N8nHealthResult> {
  const webhookUrl = getWebhookUrl(urlOverride);
  if (!webhookUrl) {
    return { connected: false, message: 'No webhook URL configured.' };
  }

  try {
    const res = await axios.get(PROXY_URL, {
      timeout: 15_000,
      headers: { 'x-n8n-webhook-url': webhookUrl },
      validateStatus: () => true,
    });

    const data = res.data as N8nHealthResult;
    if (res.status < 400) {
      return { connected: true, message: 'Connected', statusCode: data.statusCode };
    }

    return { connected: false, message: data.message || 'Connection failed', statusCode: res.status };
  } catch (err) {
    const parsed = parseN8nError(err);
    return { connected: false, message: parsed.message, statusCode: parsed.statusCode };
  }
}

/**
 * Submit the form payload to the n8n workflow via the server-side proxy.
 * The proxy bypasses CORS by making the request server-side.
 * The payload uses the EXACT field labels from the n8n Form Trigger node.
 */
export async function submitWorkflow(
  values: GenerationFormValues,
  urlOverride?: string,
  onProgress?: (chunk: string) => void,
): Promise<Record<string, unknown>> {
  const webhookUrl = getWebhookUrl(urlOverride);
  if (!webhookUrl) {
    throw {
      type: 'not_configured' as const,
      message: "We couldn't find your n8n workflow. Please configure your webhook URL in Settings.",
    } satisfies N8nError;
  }

  const payload = {
    'YouTube Video URL': values.youtubeUrl,
    'Email': values.email,
    'Target Platform': values.platforms,
    'Tone': values.tone,
    'Theme': values.theme,
    'Target Audience': values.audience,
    'Optional Human Insight / Opinion': values.humanOpinion || '',
  };

  return withRetry(async () => {
    const res = await axios.post(PROXY_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-n8n-webhook-url': webhookUrl,
      },
      timeout: TIMEOUT_MS,
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.event) {
          const target = progressEvent.event.target as XMLHttpRequest;
          if (target && target.responseText) {
            onProgress(target.responseText);
          }
        }
      },
    });
    return res.data as Record<string, unknown>;
  });
}

/**
 * Check the status of a previously submitted workflow run.
 */
export async function checkWorkflowStatus(
  _executionId: string,
  _urlOverride?: string,
): Promise<Record<string, unknown>> {
  // n8n webhook responses are synchronous — the response IS the final output.
  // This is a placeholder for future async polling support.
  return { status: 'completed' };
}
