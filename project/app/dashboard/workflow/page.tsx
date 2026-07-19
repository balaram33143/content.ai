'use client';

import { motion } from 'framer-motion';
import { Network } from 'lucide-react';
import { WorkflowDiagram } from '@/components/workflow-diagram';
import { WORKFLOW_NODES, NODE_TYPE_COLORS } from '@/config/workflow';

export default function WorkflowPage() {
  const legend = Object.entries(NODE_TYPE_COLORS);

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-2">
          <Network className="h-7 w-7 text-primary" />
          Workflow Visualization
        </h1>
        <p className="text-muted-foreground mt-1">
          The complete n8n pipeline — {WORKFLOW_NODES.length} nodes from form submission to final response.
        </p>
      </div>

      {/* Legend */}
      <div className="glass-card rounded-2xl p-4">
        <p className="text-sm font-semibold mb-3">Node Types</p>
        <div className="flex flex-wrap gap-3">
          {legend.map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
              <span className="text-xs text-muted-foreground capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Diagram */}
      <div className="max-w-2xl">
        <WorkflowDiagram
          nodeStatuses={WORKFLOW_NODES.map(() => 'idle')}
          currentNodeIndex={-1}
        />
      </div>
    </div>
  );
}
