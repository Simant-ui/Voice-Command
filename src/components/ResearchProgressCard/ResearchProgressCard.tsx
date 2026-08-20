import React from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Scale, Brain, CheckCircle2, Loader2 } from 'lucide-react';

interface ResearchProgressCardProps {
  stage: string;
  query: string;
}

export const ResearchProgressCard: React.FC<ResearchProgressCardProps> = ({ stage, query }) => {
  const getStageIcon = () => {
    if (stage.includes('Searching')) return Search;
    if (stage.includes('Reading')) return BookOpen;
    if (stage.includes('Comparing')) return Scale;
    if (stage.includes('Analyzing')) return Brain;
    if (stage.includes('ready') || stage.includes('✓')) return CheckCircle2;
    return Loader2;
  };

  const IconComponent = getStageIcon();
  const isDone = stage.includes('ready') || stage.includes('✓');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-panel p-4 rounded-2xl border border-cyan-500/30 max-w-md mx-auto w-full space-y-2.5 shadow-xl select-none"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2 text-cyan-300 font-semibold text-xs uppercase tracking-wider">
          <IconComponent className={`w-4 h-4 text-cyan-400 ${!isDone ? 'animate-spin' : ''}`} />
          <span>Real-Time Web Research</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          Live Search
        </span>
      </div>

      <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-900/60 text-xs">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-slate-200 block truncate">{stage}</span>
          <span className="text-[10px] text-slate-400 font-mono truncate block">Query: "{query}"</span>
        </div>
      </div>
    </motion.div>
  );
};
