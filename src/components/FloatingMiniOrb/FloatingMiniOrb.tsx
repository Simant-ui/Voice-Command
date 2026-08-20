import React from 'react';
import { motion } from 'framer-motion';
import { AssistantState } from '../../types';
import { Sparkles, Mic, Maximize2 } from 'lucide-react';

interface FloatingMiniOrbProps {
  state: AssistantState;
  onToggleVoice: () => void;
  onRestoreWindow: () => void;
}

export const FloatingMiniOrb: React.FC<FloatingMiniOrbProps> = ({
  state,
  onToggleVoice,
  onRestoreWindow,
}) => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 glass-panel p-2 rounded-full border border-purple-500/40 shadow-2xl cursor-grab active:cursor-grabbing bg-slate-950/90"
    >
      <button
        onClick={onToggleVoice}
        className={`w-12 h-12 rounded-full bg-gradient-to-tr ${
          state === 'LISTENING'
            ? 'from-rose-500 to-amber-500 animate-pulse'
            : 'from-purple-600 to-cyan-500'
        } flex items-center justify-center text-white shadow-lg`}
        title="Toggle Voice Mode"
      >
        {state === 'LISTENING' ? <Mic className="w-5 h-5 animate-pulse" /> : <Sparkles className="w-5 h-5" />}
      </button>

      <div className="pr-2 text-left">
        <span className="text-xs font-bold text-slate-100 block tracking-tight">Sathi AI</span>
        <span className="text-[10px] text-slate-400 font-mono">
          {state === 'LISTENING' ? 'Listening...' : state === 'EXECUTING' ? 'Executing...' : 'Click to Speak'}
        </span>
      </div>

      <button
        onClick={onRestoreWindow}
        className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        title="Maximize Window"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
