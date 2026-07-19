'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileSpreadsheet, ExternalLink, FileText } from 'lucide-react';
import { fetchHistory } from '@/services/generations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { GenerationRecord } from '@/types';

export default function ReportsPage() {
  const { data } = useQuery({
    queryKey: ['history', { status: 'completed', page: 1, pageSize: 100 }],
    queryFn: () => fetchHistory({ status: 'completed', page: 1, pageSize: 100 }),
  });

  const reports: GenerationRecord[] = (data?.records || []).filter(
    (r: GenerationRecord) => r.report_url,
  );

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      <div>
        <h1 className="font-display text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-1">Google Doc reports from completed generations.</p>
      </div>

      {reports.length === 0 ? (
        <Card className="glass-card rounded-2xl p-12 text-center text-muted-foreground">
          <FileSpreadsheet className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No reports yet. Complete a generation to see reports here.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 shrink-0">
                    <FileSpreadsheet className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.youtube_url}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {r.tone} • {r.theme} • {new Date(r.created_at).toLocaleDateString()}
                    </p>
                    <Button size="sm" variant="outline" className="mt-3 rounded-lg" asChild>
                      <a href={r.report_url || '#'} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Open Report
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
