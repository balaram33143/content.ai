'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export interface WorkflowProgressProps {
  active: boolean;
  currentNodeIndex: number;
  nodeStatuses: NodeStatus[];
}

export function WorkflowProgress({ active, currentNodeIndex, nodeStatuses }: WorkflowProgressProps) {
  const completedCount = nodeStatuses.filter((s) => s === 'completed').length;
  const progress = Math.round((completedCount / WORKFLOW_NODES.length) * 100);

  if (!active) return null;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Workflow Progress</h3>
          <span className="text-2xl font-bold text-primary tabular-nums">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {completedCount} of {WORKFLOW_NODES.length} nodes completed
        </p>
      </div>

      {/* Node list */}
      <div className="glass-card rounded-2xl p-4 max-h-[500px] overflow-y-auto">
        <div className="space-y-1">
          {WORKFLOW_NODES.map((node, i) => {
            const status = nodeStatuses[i] || 'idle';
            const Icon = STATUS_ICONS[status];
            const isActive = i === currentNodeIndex;
            return (
              <motion.div
                key={node.id}
                initial={false}
                animate={{
                  opacity: status === 'idle' ? 0.5 : 1,
                  scale: isActive ? 1.02 : 1,
                }}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
                  isActive && 'bg-primary/10',
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', STATUS_COLORS[status], status === 'running' && 'animate-spin')} />
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium truncate', status === 'idle' && 'text-muted-foreground')}>
                    {node.label}
                  </p>
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-muted-foreground truncate"
                    >
                      {node.description}
                    </motion.p>
                  )}
                </div>
                <div className={cn('h-2 w-2 rounded-full shrink-0', NODE_TYPE_COLORS[node.type])} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function useWorkflowProgress() {
  const [active, setActive] = useState(false);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(-1);
  const [nodeStatuses, setNodeStatuses] = useState<NodeStatus[]>(
    WORKFLOW_NODES.map(() => 'idle' as NodeStatus),
  );

  const reset = useCallback(() => {
    setActive(false);
    setCurrentNodeIndex(-1);
    setNodeStatuses(WORKFLOW_NODES.map(() => 'idle'));
  }, []);

  const start = useCallback(() => {
    setNodeStatuses(WORKFLOW_NODES.map(() => 'idle'));
    setCurrentNodeIndex(0);
    setActive(true);
  }, []);

  const completeAll = useCallback(() => {
    setNodeStatuses(WORKFLOW_NODES.map(() => 'completed'));
    setCurrentNodeIndex(WORKFLOW_NODES.length - 1);
  }, []);

  const failAt = useCallback((index: number) => {
    setNodeStatuses((prev: NodeStatus[]) => prev.map((s: NodeStatus, i: number) => (i === index ? 'failed' : s)));
  }, []);

  // Simulate progress over the expected workflow duration
  const simulateProgress = useCallback((durationMs = 180000) => {
    start();
    const total = WORKFLOW_NODES.length;
    const interval = durationMs / total;
    let i = 0;

    const tick = () => {
      if (i >= total) return;
      setCurrentNodeIndex(i);
      setNodeStatuses((prev: NodeStatus[]) => {
        const next = [...prev];
        next[i] = 'running';
        return next;
      });

      setTimeout(() => {
        setNodeStatuses((prev: NodeStatus[]) => {
          const next = [...prev];
          next[i] = 'completed';
          return next;
        });
        i++;
        if (i < total) {
          setTimeout(tick, interval);
        } else {
          setCurrentNodeIndex(total - 1);
        }
      }, interval * 0.7);
    };

    tick();
  }, [start]);

  return {
    active,
    currentNodeIndex,
    nodeStatuses,
    reset,
    start,
    completeAll,
    failAt,
    simulateProgress,
  };
}
