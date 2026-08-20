import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Circle, Wrench } from 'lucide-react';
import { PlannedStep } from '../../services/agent/AgentPlanner';

interface LiveActionCardProps {
  steps: PlannedStep[];
  currentStepIndex: number;
  isCompleted: boolean;
}

export const LiveActionCard: React.FC<LiveActionCardProps> = ({
  steps,
  currentStepIndex,
  isCompleted,
}) => {
  if (!steps || steps.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-panel p-4 rounded-2xl border border-purple-500/30 max-w-md mx-auto w-full space-y-3 shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2 text-purple-300 font-semibold text-xs uppercase tracking-wider">
          <Wrench className="w-4 h-4 text-cyan-400" />
          <span>{isCompleted ? '✓ Task Completed' : '⚙ Action Execution Pipeline'}</span>
        </div>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase ${
            isCompleted
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse'
          }`}
        >
          {isCompleted ? 'Verified' : `Step ${currentStepIndex + 1}/${steps.length}`}
        </span>
      </div>

      <div className="space-y-2">
        {steps.map((step, idx) => {
          const isDone = isCompleted || idx < currentStepIndex;
          const isCurrent = !isCompleted && idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center space-x-3 p-2 rounded-xl text-xs transition-colors ${
                isCurrent
                  ? 'bg-purple-500/15 border border-purple-500/30 text-white'
                  : isDone
                  ? 'bg-slate-900/40 text-emerald-300'
                  : 'bg-slate-900/20 text-slate-500'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-600 shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <span className="font-medium truncate block">{step.description}</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {step.toolName}({JSON.stringify(step.args)})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
