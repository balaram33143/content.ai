'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Settings as SettingsIcon,
  Bell,
  Link2,
  Palette,
  Save,
  Loader2,
  CheckCircle2,
  XCircle,
  Zap,
  Info,
} from 'lucide-react';
import { useSettings } from '@/context/settings-context';
import { useTheme } from '@/context/theme-provider';
import { ENV_WEBHOOK_URL } from '@/config/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SettingsPage() {
  const { settings, updateSettings, webhookUrl, connectionStatus, testing, testConnection } = useSettings();
  const { theme, setTheme } = useTheme();
  const [urlInput, setUrlInput] = useState(settings.webhookUrl || ENV_WEBHOOK_URL);

  const handleSave = () => {
    updateSettings({ webhookUrl: urlInput.trim() });
    toast.success('Settings saved');
  };

  const handleTest = async () => {
    if (!urlInput.trim()) {
      toast.error('Enter a webhook URL first');
      return;
    }
    updateSettings({ webhookUrl: urlInput.trim() });
    toast.info('Testing workflow connection...');
    const result = await testConnection();
    if (result.connected) {
      toast.success('Connected to n8n workflow');
    } else {
      toast.error(`Connection failed: ${result.message}`);
    }
  };

  const envActive = !!ENV_WEBHOOK_URL;

  return (
    <div className="space-y-6 pt-12 lg:pt-0 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your webhook, theme, and preferences.</p>
      </div>

      {/* Webhook URL */}
      <Card className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">n8n Webhook URL</h2>
        </div>

        {envActive && (
          <div className="flex items-start gap-2 rounded-lg bg-primary/10 p-3 text-sm">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-muted-foreground">
              An environment variable (<code className="px-1 rounded bg-muted text-xs">NEXT_PUBLIC_N8N_WEBHOOK_URL</code>)
              is set. You can override it below — the saved value takes priority.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="webhook">Webhook URL</Label>
          <Input
            id="webhook"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://your-n8n-instance.com/webhook/your-webhook-id"
          />
          <p className="text-xs text-muted-foreground">
            Find this in your n8n workflow: open the Form Trigger node → copy the Production URL.
          </p>
        </div>

        {/* Connection status */}
        {connectionStatus && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'flex items-center gap-2 rounded-lg p-3 text-sm',
              connectionStatus.connected
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-destructive/10 text-destructive',
            )}
          >
            {connectionStatus.connected ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0" />
            )}
            <span>
              {connectionStatus.connected
                ? 'Connected'
                : `Connection failed${connectionStatus.statusCode ? ` (HTTP ${connectionStatus.statusCode})` : ''}: ${connectionStatus.message}`}
            </span>
          </motion.div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleSave} className="rounded-xl" disabled={!urlInput.trim()}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button
            onClick={handleTest}
            variant="outline"
            className="rounded-xl"
            disabled={testing || !urlInput.trim()}
          >
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Test Connection
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Theme */}
      <Card className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Appearance</h2>
        </div>
        <div className="space-y-2">
          <Label>Theme</Label>
          <Select value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark' | 'system')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Notifications</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Toast notifications</p>
            <p className="text-xs text-muted-foreground">Show success and error toasts.</p>
          </div>
          <Switch
            checked={settings.notifications}
            onCheckedChange={(v) => updateSettings({ notifications: v })}
          />
        </div>
      </Card>
    </div>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
