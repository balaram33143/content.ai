'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Download, Image as ImageIcon, FolderOpen, FileText, FileJson } from 'lucide-react';
import { fetchHistory } from '@/services/generations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { GenerationRecord } from '@/types';

export default function DownloadsPage() {
  const { data } = useQuery({
    queryKey: ['history', { status: 'completed', page: 1, pageSize: 100 }],
    queryFn: () => fetchHistory({ status: 'completed', page: 1, pageSize: 100 }),
  });

  const records: GenerationRecord[] = (data?.records || []).filter(
    (r: GenerationRecord) => r.image_url || r.folder_url || r.metadata_file_url,
  );

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      <div>
        <h1 className="font-display text-3xl font-bold">Downloads</h1>
        <p className="text-muted-foreground mt-1">Access generated images, Drive folders, and metadata files.</p>
      </div>

      {records.length === 0 ? (
        <Card className="glass-card rounded-2xl p-12 text-center text-muted-foreground">
          <Download className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No downloads available yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {records.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="glass-card rounded-2xl p-5">
                <p className="text-sm font-medium truncate mb-3">{r.youtube_url}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {r.image_url && (
                    <a href={r.image_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border p-3 hover:bg-muted/50 transition-colors group">
                      <ImageIcon className="h-5 w-5 text-violet-500 shrink-0" />
                      <span className="text-sm font-medium">AI Image</span>
                      <Download className="h-4 w-4 text-muted-foreground ml-auto group-hover:translate-y-0.5 transition-transform" />
                    </a>
                  )}
                  {r.folder_url && (
                    <a href={r.folder_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border p-3 hover:bg-muted/50 transition-colors group">
                      <FolderOpen className="h-5 w-5 text-yellow-500 shrink-0" />
                      <span className="text-sm font-medium">Drive Folder</span>
                      <Download className="h-4 w-4 text-muted-foreground ml-auto group-hover:translate-y-0.5 transition-transform" />
                    </a>
                  )}
                  {r.metadata_file_url && (
                    <a href={r.metadata_file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border p-3 hover:bg-muted/50 transition-colors group">
                      <FileJson className="h-5 w-5 text-cyan-500 shrink-0" />
                      <span className="text-sm font-medium">Metadata JSON</span>
                      <Download className="h-4 w-4 text-muted-foreground ml-auto group-hover:translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
