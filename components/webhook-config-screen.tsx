'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Webhook, Loader2, CheckCircle2, XCircle, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import { useSettings } from '@/context/settings-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function WebhookConfigScreen() {
  const router = useRouter();
  const { updateSettings, testConnection, testing } = useSettings();
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<{ connected: boolean; message: string; statusCode?: number } | null>(null);

  const handleSaveAndTest = async () => {
    if (!url.trim()) {
      toast.error('Enter a webhook URL');
      return;
    }

    updateSettings({ webhookUrl: url.trim() });
    toast.info('Testing workflow connection...');

    const res = await testConnection();
    setResult(res);

    if (res.connected) {
      toast.success('Connected! Redirecting to dashboard...');
      setTimeout(() => router.push('/dashboard/generate'), 800);
    } else {
      toast.error(`Connection failed: ${res.message}`);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="glass-card rounded-3xl p-8 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="rounded-2xl bg-primary/10 p-4">
              <Webhook className="h-10 w-10 text-primary" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="font-display text-2xl font-bold">Webhook URL Required</h1>
            <p className="text-muted-foreground text-sm">
              Enter your n8n webhook URL to continue. This connects the frontend to your existing workflow.
            </p>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <Label htmlFor="webhook-setup">n8n Webhook URL</Label>
            <Input
              id="webhook-setup"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-n8n-instance.com/webhook/your-webhook-id"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveAndTest();
              }}
            />
            <p className="text-xs text-muted-foreground">
              In n8n, open your workflow's Form Trigger node and copy the Production URL.
            </p>
          </div>

          {/* Connection result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                result.connected
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {result.connected ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0" />
              )}
              <span>
                {result.connected
                  ? 'Connected'
                  : `Connection failed${result.statusCode ? ` (HTTP ${result.statusCode})` : ''}: ${result.message}`}
              </span>
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSaveAndTest}
              className="flex-1 rounded-xl"
              disabled={testing || !url.trim()}
            >
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Workflow...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Save & Test Connection
                </>
              )}
            </Button>
          </div>

          {/* Help link */}
          <div className="text-center">
            <a
              href="/dashboard/help"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Need help? Read the setup guide
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>

          {/* Hint */}
          <div className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">How to find your webhook URL:</p>
            <ol className="list-decimal list-inside space-y-0.5 pl-1">
              <li>Open your workflow in n8n</li>
              <li>Click the <strong>Form Trigger</strong> node</li>
              <li>Copy the <strong>Production URL</strong> under "Webhook URL"</li>
              <li>Paste it above and click <strong>Save & Test</strong></li>
            </ol>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
