'use client';

import { useSettings } from '@/context/settings-context';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { WebhookConfigScreen } from '@/components/webhook-config-screen';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { webhookConfigured } = useSettings();

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
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
