import type { AppSettings } from '@/types';

const STORAGE_KEY = 'contentforge_settings';

const ENV_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';

function readSettingsFromStorage(): Partial<AppSettings> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<AppSettings>;
  } catch {
    return null;
  }
}

/**
 * Resolve the n8n webhook URL in priority order:
 * 1. Explicit override (passed from a component, e.g. Settings page)
 * 2. Environment variable NEXT_PUBLIC_N8N_WEBHOOK_URL
 * 3. localStorage (saved by the Settings page)
 * 4. Empty string (not yet configured)
 */
export function resolveWebhookUrl(override?: string): string {
  if (override && override.trim()) return override.trim();
  if (ENV_WEBHOOK_URL) return ENV_WEBHOOK_URL;
  const stored = readSettingsFromStorage();
  if (stored?.webhookUrl && stored.webhookUrl.trim()) return stored.webhookUrl.trim();
  return '';
}

export function isWebhookConfigured(override?: string): boolean {
  return resolveWebhookUrl(override).length > 0;
}

export { ENV_WEBHOOK_URL, STORAGE_KEY };
