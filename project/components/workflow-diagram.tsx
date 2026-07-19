'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Clock, XCircle, Circle } from 'lucide-react';
import { WORKFLOW_NODES, NODE_TYPE_COLORS } from '@/config/workflow';
import type { NodeStatus } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_ICONS: Record<NodeStatus, React.ComponentType<{ className?: string }>> = {
  idle: Circle,
  running: Loader2,
  waiting: Clock,
  completed: CheckCircle2,
  failed: XCircle,
};

const STATUS_COLORS: Record<NodeStatus, string> = {
  idle: 'text-muted-foreground/40',
  running: 'text-primary',
  waiting: 'text-amber-500',
  completed: 'text-emerald-500',
  failed: 'text-rose-500',
};

interface WorkflowDiagramProps {
  nodeStatuses?: NodeStatus[];
  currentNodeIndex?: number;
}

export function WorkflowDiagram({
  nodeStatuses = WORKFLOW_NODES.map(() => 'completed'),
  currentNodeIndex = -1,
}: WorkflowDiagramProps) {
  return (
    <div className="space-y-1">
      {WORKFLOW_NODES.map((node, i) => {
        const status = nodeStatuses[i] || 'idle';
        const Icon = STATUS_ICONS[status];
        const isActive = i === currentNodeIndex;
        const isLast = i === WORKFLOW_NODES.length - 1;

        return (
          <div key={node.id}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className={cn(
                'flex items-center gap-3 rounded-xl border p-3 transition-all',
                isActive ? 'border-primary bg-primary/5 shadow-md' : 'border-border glass-card',
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0', STATUS_COLORS[status], status === 'running' && 'animate-spin')} />
              <div className={cn('h-2.5 w-2.5 rounded-full shrink-0', NODE_TYPE_COLORS[node.type])} />
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium truncate', status === 'idle' && 'text-muted-foreground')}>
                  {node.label}
                </p>
                <p className="text-xs text-muted-foreground truncate capitalize">{node.type}</p>
              </div>
              <span className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full shrink-0',
                status === 'completed' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                status === 'running' && 'bg-primary/10 text-primary',
                status === 'waiting' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                status === 'failed' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                status === 'idle' && 'bg-muted text-muted-foreground',
              )}>
                {status}
              </span>
            </motion.div>
            {!isLast && (
              <div className="flex justify-center py-0.5">
                <div className="h-4 w-0.5 bg-border" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
