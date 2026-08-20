import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssistantState } from '../../types';
import { Mic, Radio, Cpu, Volume2, AlertCircle } from 'lucide-react';

interface AssistantOrbProps {
  state: AssistantState;
  onClick?: () => void;
  size?: number;
}

export const AssistantOrb: React.FC<AssistantOrbProps> = ({ state, onClick, size = 180 }) => {
  // Orb color themes per state
  const getOrbTheme = () => {
    switch (state) {
      case 'LISTENING':
        return {
          core: 'from-cyan-400 via-blue-500 to-sky-300',
          glow: 'shadow-[0_0_60px_rgba(56,189,248,0.6)]',
          ring: 'border-cyan-400/60',
          label: 'Listening...',
          icon: Mic,
        };
      case 'THINKING':
      case 'EXECUTING':
        return {
          core: 'from-indigo-500 via-purple-600 to-pink-500',
          glow: 'shadow-[0_0_60px_rgba(129,140,248,0.6)]',
          ring: 'border-indigo-400/60',
          label: 'Thinking...',
          icon: Cpu,
        };
      case 'SPEAKING':
        return {
          core: 'from-emerald-400 via-teal-500 to-cyan-400',
          glow: 'shadow-[0_0_60px_rgba(52,211,153,0.6)]',
          ring: 'border-emerald-400/60',
          label: 'Speaking...',
          icon: Volume2,
        };
      case 'ERROR':
        return {
          core: 'from-rose-500 via-red-600 to-amber-500',
          glow: 'shadow-[0_0_60px_rgba(244,63,94,0.6)]',
          ring: 'border-rose-400/60',
          label: 'Attention Needed',
          icon: AlertCircle,
        };
      case 'IDLE':
      default:
        return {
          core: 'from-sky-400 via-blue-600 to-indigo-700',
          glow: 'shadow-[0_0_50px_rgba(2,132,199,0.45)]',
          ring: 'border-sky-500/40',
          label: 'Santosh AI Ready',
          icon: Radio,
        };
    }
  };

  const theme = getOrbTheme();
  const IconComponent = theme.icon;

  return (
    <div className="relative flex flex-col items-center justify-center group select-none">
      {/* Outer audio pulse wave rings when LISTENING or SPEAKING */}
      <AnimatePresence>
        {(state === 'LISTENING' || state === 'SPEAKING') && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.2, 0.7, 0], scale: [0.9, 1.4, 1.7] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
              className="absolute rounded-full border border-cyan-400/40 pointer-events-none"
              style={{ width: size * 1.5, height: size * 1.5 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.1, 0.5, 0], scale: [1, 1.6, 2] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.5, ease: 'easeOut' }}
              className="absolute rounded-full border border-sky-400/30 pointer-events-none"
              style={{ width: size * 1.5, height: size * 1.5 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Orbiting particle ring when THINKING or EXECUTING */}
      {(state === 'THINKING' || state === 'EXECUTING') && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          className="absolute rounded-full border-2 border-dashed border-indigo-400/60 pointer-events-none"
          style={{ width: size * 1.3, height: size * 1.3 }}
        />
      )}

      {/* Main Interactive Animated Orb Core */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={
          state === 'LISTENING'
            ? { scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }
            : state === 'THINKING' || state === 'EXECUTING'
            ? { scale: [1, 0.96, 1] }
            : state === 'SPEAKING'
            ? { scale: [1, 1.05, 0.98, 1.04, 1] }
            : { y: [0, -8, 0] } // Gentle float when IDLE
        }
        transition={{
          repeat: Infinity,
          duration: state === 'LISTENING' ? 1.5 : state === 'THINKING' || state === 'EXECUTING' ? 1 : state === 'SPEAKING' ? 1.2 : 4,
          ease: 'easeInOut',
        }}
        className={`relative rounded-full bg-gradient-to-tr ${theme.core} ${theme.glow} flex items-center justify-center cursor-pointer transition-all duration-500 border-2 ${theme.ring}`}
        style={{ width: size, height: size }}
      >
        {/* Inner Liquid Glass Light Reflection */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-b from-white/30 via-transparent to-transparent pointer-events-none" />
        
        {/* Core Center Icon */}
        <div className="relative z-10 flex flex-col items-center justify-center text-white drop-shadow-md">
          <IconComponent className={`w-10 h-10 ${state === 'THINKING' || state === 'EXECUTING' ? 'animate-spin' : ''}`} />
        </div>
      </motion.button>

      {/* Status Label & Privacy Badge */}
      <div className="mt-4 flex flex-col items-center space-y-1">
        <span className="text-sm font-semibold tracking-wider uppercase text-slate-300 drop-shadow">
          {theme.label}
        </span>

        {/* Explicit Privacy Recording Indicator as required by specifications */}
        {state === 'LISTENING' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>🎤 Microphone Active</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
