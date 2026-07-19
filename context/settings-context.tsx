'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { AppSettings } from '@/types';
import { ENV_WEBHOOK_URL, STORAGE_KEY } from '@/config/api';
import { healthCheck, type N8nHealthResult } from '@/services/n8n';

interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  webhookUrl: string;
  webhookConfigured: boolean;
  demoMode: boolean;
  connectionStatus: N8nHealthResult | null;
  testing: boolean;
  testConnection: () => Promise<N8nHealthResult>;
  clearConnectionStatus: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  webhookUrl: ENV_WEBHOOK_URL,
  theme: 'system',
  notifications: true,
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<N8nHealthResult | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings, loaded]);

  const webhookUrl = settings.webhookUrl || ENV_WEBHOOK_URL;
  const webhookConfigured = true;
  const demoMode = webhookUrl.trim().length === 0;

  const testConnection = useCallback(async (): Promise<N8nHealthResult> => {
    setTesting(true);
    try {
      const result = await healthCheck(webhookUrl);
      setConnectionStatus(result);
      return result;
    } finally {
      setTesting(false);
    }
  }, [webhookUrl]);

  const clearConnectionStatus = useCallback(() => setConnectionStatus(null), []);

  const updateSettings = useCallback(
    (partial: Partial<AppSettings>) => setSettings((prev) => ({ ...prev, ...partial })),
    [],
  );

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        webhookUrl,
        webhookConfigured,
        demoMode,
        connectionStatus,
        testing,
        testConnection,
        clearConnectionStatus,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
