'use client';

import { Sparkles } from 'lucide-react';
import { useSettings } from '@/context/settings-context';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { WebhookConfigScreen } from '@/components/webhook-config-screen';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { webhookConfigured, demoMode } = useSettings();

  if (!webhookConfigured) {
    return (
      <div className="min-h-screen bg-mesh">
        <DashboardSidebar />
        <main className="lg:pl-72 min-h-screen">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <WebhookConfigScreen />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh">
      <DashboardSidebar />
      <main className="lg:pl-72 min-h-screen">
        {demoMode && (
          <div className="sticky top-0 z-30 border-b border-amber-500/30 bg-amber-500/10 backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-amber-800 dark:text-amber-200">
                <strong>Demo mode:</strong> generating sample content locally.{' '}
                <a href="/dashboard/settings" className="underline hover:no-underline font-semibold">
                  Configure your n8n webhook
                </a>{' '}
                to run the real workflow.
              </span>
            </div>
          </div>
        )}
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
