'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  History as HistoryIcon,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { fetchHistory, deleteGeneration } from '@/services/generations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { GenerationStatus, GenerationRecord } from '@/types';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 8;

export default function HistoryPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<GenerationStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [page, setPage] = useState(1);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['history', { search, status, sortBy, page }],
    queryFn: () =>
      fetchHistory({
        search: search || undefined,
        status,
        sortBy,
        page,
        pageSize: PAGE_SIZE,
      }),
  });

  const records: GenerationRecord[] = data?.records || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteGeneration(id);
    if (ok) {
      toast.success('Generation deleted');
      queryClient.invalidateQueries({ queryKey: ['history'] });
    } else {
      toast.error('Failed to delete');
    }
  };

  const statusBadge = (s: string) => {
    const styles: Record<string, string> = {
      completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      failed: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      running: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    };
    return styles[s] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      <div>
        <h1 className="font-display text-3xl font-bold">History</h1>
        <p className="text-muted-foreground mt-1">Browse, search, and manage past generations.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by URL, email, tone, or theme..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v as GenerationStatus | 'all'); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'newest' | 'oldest')}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      <Card className="glass-card rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl animate-shimmer" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <HistoryIcon className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No generations found.</p>
          </div>
        ) : (
          <div className="divide-y">
            <AnimatePresence>
              {records.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className={cn('flex h-2.5 w-2.5 rounded-full shrink-0', {
                    'bg-emerald-500': r.status === 'completed',
                    'bg-rose-500': r.status === 'failed',
                    'bg-amber-500': r.status === 'running' || r.status === 'pending',
                  })} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.youtube_url}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {r.platforms} • {r.tone} • {r.theme} • {new Date(r.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full hidden sm:inline-block', statusBadge(r.status))}>
                    {r.status}
                  </span>
                  <div className="flex gap-1">
                    {r.status === 'completed' && r.report_url && (
                      <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                        <a href={r.report_url} target="_blank" rel="noopener noreferrer" title="View report">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(r.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} • {total} total
          </p>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
