'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wand2,
  History,
  FileText,
  Download,
  ArrowRight,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchHistory } from '@/services/generations';
import { Card } from '@/components/ui/card';
import { MockDataBanner } from '@/components/mock-data-banner';
import type { GenerationRecord } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

export default function DashboardPage() {
  const { data } = useQuery({
    queryKey: ['history', { page: 1, pageSize: 100 }],
    queryFn: () => fetchHistory({ page: 1, pageSize: 100 }),
  });

  const records: GenerationRecord[] = data?.records || [];
  const total = data?.total || 0;
  const completed = records.filter((r) => r.status === 'completed').length;
  const failed = records.filter((r) => r.status === 'failed').length;
  const running = records.filter((r) => r.status === 'running' || r.status === 'pending').length;

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      <MockDataBanner />

      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's your content overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Generations', value: total, icon: Activity, color: 'text-primary' },
          { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Running', value: running, icon: Clock, color: 'text-amber-500' },
          { label: 'Failed', value: failed, icon: XCircle, color: 'text-rose-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Card className="glass-card p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: '/dashboard/generate', label: 'Generate Content', icon: Wand2, desc: 'Start a new generation' },
          { href: '/dashboard/history', label: 'View History', icon: History, desc: 'Browse past runs' },
          { href: '/dashboard/reports', label: 'Reports', icon: FileText, desc: 'View Google Docs' },
          { href: '/dashboard/downloads', label: 'Downloads', icon: Download, desc: 'Get your files' },
        ].map((action, i) => (
          <motion.div
            key={action.href}
            custom={i + 4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Link href={action.href}>
              <Card className="glass-card p-5 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                <action.icon className="h-6 w-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold">{action.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{action.desc}</p>
                <ArrowRight className="h-4 w-4 text-muted-foreground mt-3 group-hover:translate-x-1 transition-transform" />
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="font-display text-xl font-semibold mb-4">Recent Activity</h2>
        <Card className="glass-card rounded-2xl overflow-hidden">
          {records.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <History className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>No generations yet. Start by creating one.</p>
              <Link href="/dashboard/generate">
                <button className="mt-4 text-primary font-medium text-sm hover:underline">
                  Generate Content →
                </button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {records.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                  <div className={`flex h-2 w-2 rounded-full shrink-0 ${
                    r.status === 'completed' ? 'bg-emerald-500' :
                    r.status === 'failed' ? 'bg-rose-500' : 'bg-amber-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.youtube_url}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.platforms} • {r.tone} • {new Date(r.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    r.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                    r.status === 'failed' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                    'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
