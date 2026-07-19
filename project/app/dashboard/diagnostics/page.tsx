'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DiagnosticResult {
  name: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
  // Keep API flexibility, but ensure rendering is always a string.
  details?: unknown;
}


interface DiagnosticResponse {
  severity: 'info' | 'warning' | 'error';
  summary: string;
  results: DiagnosticResult[];
}

export default function DiagnosticsPage() {
  const [data, setData] = useState<DiagnosticResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiagnostics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/diagnostic');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch diagnostics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const getIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getBgColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">System Diagnostics</h1>
          <p className="text-muted-foreground mt-1">Check the status of your connections</p>
        </div>
        <Button onClick={fetchDiagnostics} disabled={loading} size="sm" variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Checking...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
          <p className="text-red-800 dark:text-red-200">
            <XCircle className="w-5 h-5 inline mr-2" />
            {error}
          </p>
        </Card>
      )}

      {data && (
        <>
          <Card className={`p-4 border ${data.severity === 'info' ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' : data.severity === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800' : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'}`}>
            <p className="font-semibold text-lg">{data.summary}</p>
          </Card>

          <div className="grid gap-4">
            {data.results.map((result, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className={`p-4 border ${getBgColor(result.status)}`}>
                  <div className="flex items-start gap-3">
                    {getIcon(result.status)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{result.name}</h3>
                      <p className="text-sm opacity-75 mt-1">{result.message}</p>
                      {result.details !== undefined && result.details !== null && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer opacity-50 hover:opacity-75">
                            Details
                          </summary>
                          <pre className="mt-2 text-xs bg-black/10 dark:bg-white/10 p-2 rounded overflow-auto max-h-40">
                            {(() => {
                              try {
                                return typeof result.details === 'string'
                                  ? result.details
                                  : JSON.stringify(result.details, null, 2);
                              } catch {
                                return String(result.details);
                              }
                            })()}
                          </pre>
                        </details>
                      )}

                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="p-4 bg-muted">
            <h3 className="font-semibold mb-3">Need Help?</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/dashboard/settings"
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  ⚙️ Configure webhook URL in Settings
                </a>
              </li>
              <li>
                <a
                  href="/SETUP.md"
                  className="text-primary hover:underline flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📖 Read Setup Guide <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://supabase.com/docs"
                  className="text-primary hover:underline flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🔗 Supabase Docs <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://docs.n8n.io/"
                  className="text-primary hover:underline flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🔗 n8n Docs <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}
