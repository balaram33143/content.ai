import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

interface DiagnosticResult {
  name: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
  details?: unknown;
}

export async function GET(req: NextRequest) {
  const results: DiagnosticResult[] = [];

  // Check n8n webhook URL
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL || '';
  results.push({
    name: 'n8n Webhook URL',
    status: webhookUrl ? 'ok' : 'error',
    message: webhookUrl ? 'Webhook URL is configured' : 'Webhook URL not configured',
    details: webhookUrl ? { url: webhookUrl } : undefined,
  });

  // Check Supabase URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  results.push({
    name: 'Supabase URL',
    status: supabaseUrl ? 'ok' : 'error',
    message: supabaseUrl ? 'Supabase URL is configured' : 'Supabase URL not configured',
    details: supabaseUrl ? { url: supabaseUrl } : undefined,
  });

  // Check Supabase Key
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  results.push({
    name: 'Supabase Key',
    status: supabaseKey ? 'ok' : 'error',
    message: supabaseKey ? 'Supabase key is configured' : 'Supabase key not configured',
  });

  // Test Supabase connection
  if (supabaseUrl && supabaseKey) {
    try {
      const { data, error } = await supabase.from('generations').select('count').limit(1);
      if (error) {
        results.push({
          name: 'Supabase Connection',
          status: error.message.includes('permission') ? 'warning' : 'error',
          message: `Failed to connect to Supabase: ${error.message}`,
          details: error,
        });
      } else {
        results.push({
          name: 'Supabase Connection',
          status: 'ok',
          message: 'Successfully connected to Supabase database',
        });
      }
    } catch (err) {
      results.push({
        name: 'Supabase Connection',
        status: 'error',
        message: `Exception connecting to Supabase: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  } else {
    results.push({
      name: 'Supabase Connection',
      status: 'error',
      message: 'Supabase URL and key not configured, skipping connection test',
    });
  }

  // Test n8n webhook
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true }),
        signal: AbortSignal.timeout(5000),
      });

      if (response.status === 404) {
        results.push({
          name: 'n8n Webhook',
          status: 'error',
          message: 'Webhook URL not found (404). Workflow may be inactive or URL incorrect.',
          details: { statusCode: response.status },
        });
      } else if (response.ok || response.status === 400) {
        results.push({
          name: 'n8n Webhook',
          status: 'ok',
          message: 'Webhook is reachable and responding',
          details: { statusCode: response.status },
        });
      } else {
        results.push({
          name: 'n8n Webhook',
          status: 'warning',
          message: `Webhook returned status ${response.status}`,
          details: { statusCode: response.status },
        });
      }
    } catch (err) {
      results.push({
        name: 'n8n Webhook',
        status: 'error',
        message: `Unable to reach webhook: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }

  const allOk = results.every((r) => r.status === 'ok');
  const severity = allOk ? 'info' : results.some((r) => r.status === 'error') ? 'error' : 'warning';

  return NextResponse.json(
    {
      severity,
      results,
      summary:
        allOk ? '✓ All systems operational' : `⚠ ${results.filter((r) => r.status !== 'ok').length} issues found`,
    },
    { status: 200 }, // Always return 200 so frontend can display results
  );
}
