import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssistantState } from '../../types';
import { Mic, Radio, Cpu, Settings, Volume2, Check, AlertTriangle, Moon, ShieldCheck } from 'lucide-react';

interface NovaOrbProps {
  state: AssistantState;
  actionText?: string;
  onClick?: () => void;
  size?: number;
}

export const NovaOrb: React.FC<NovaOrbProps> = ({
  state,
  actionText,
  onClick,
  size = 190,
}) => {
  // Orb color themes per state
  const getOrbTheme = () => {
    switch (state) {
      case 'SLEEPING':
        return {
          core: 'from-slate-800 via-slate-900 to-indigo-950',
          glow: 'shadow-[0_0_35px_rgba(99,102,241,0.25)]',
          ring: 'border-slate-700/60',
          label: "Sleeping (Say 'Hey Sathi')",
          icon: Moon,
        };
      case 'LISTENING':
        return {
          core: 'from-rose-500 via-pink-600 to-purple-600',
          glow: 'shadow-[0_0_65px_rgba(244,63,94,0.6)]',
          ring: 'border-rose-400/70',
          label: 'Listening for Command...',
          icon: Mic,
        };
      case 'THINKING':
        return {
          core: 'from-purple-500 via-violet-600 to-indigo-700',
          glow: 'shadow-[0_0_65px_rgba(139,92,246,0.6)]',
          ring: 'border-purple-400/60',
          label: 'Thinking...',
          icon: Cpu,
        };
      case 'EXECUTING':
        return {
          core: 'from-emerald-500 via-teal-600 to-cyan-500',
          glow: 'shadow-[0_0_65px_rgba(16,185,129,0.6)]',
          ring: 'border-emerald-400/60',
          label: actionText || 'Executing Action...',
          icon: Settings,
        };
      case 'SPEAKING':
        return {
          core: 'from-teal-400 via-cyan-500 to-blue-500',
          glow: 'shadow-[0_0_60px_rgba(45,212,191,0.55)]',
          ring: 'border-teal-400/60',
          label: 'Speaking...',
          icon: Volume2,
        };
      case 'SUCCESS':
        return {
          core: 'from-emerald-400 via-green-500 to-teal-600',
          glow: 'shadow-[0_0_60px_rgba(34,197,94,0.6)]',
          ring: 'border-emerald-400/80',
          label: 'Task Completed',
          icon: Check,
        };
      case 'ERROR':
        return {
          core: 'from-rose-500 via-red-600 to-amber-500',
          glow: 'shadow-[0_0_60px_rgba(244,63,94,0.6)]',
          ring: 'border-rose-400/60',
          label: 'Attention Needed',
          icon: AlertTriangle,
        };
      case 'IDLE':
      default:
        return {
          core: 'from-purple-600 via-indigo-600 to-cyan-500',
          glow: 'shadow-[0_0_55px_rgba(112,0,255,0.45)]',
          ring: 'border-purple-400/40',
          label: 'Sathi AI Ready',
          icon: Radio,
        };
    }
  };

  const theme = getOrbTheme();
  const IconComponent = theme.icon;

  return (
    <div className="relative flex flex-col items-center justify-center group select-none">
      {/* Waveforms & Audio Rings when LISTENING or SPEAKING */}
      <AnimatePresence>
        {(state === 'LISTENING' || state === 'SPEAKING') && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.2, 0.7, 0], scale: [0.95, 1.45, 1.75] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
              className={`absolute rounded-full border ${state === 'LISTENING' ? 'border-rose-400/40' : 'border-cyan-400/40'} pointer-events-none`}
              style={{ width: size * 1.5, height: size * 1.5 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.1, 0.5, 0], scale: [1, 1.6, 2.1] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.5, ease: 'easeOut' }}
              className="absolute rounded-full border border-purple-400/30 pointer-events-none"
              style={{ width: size * 1.5, height: size * 1.5 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Orbiting particles ring when THINKING or EXECUTING */}
      {(state === 'THINKING' || state === 'EXECUTING') && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: state === 'THINKING' ? 3 : 2, ease: 'linear' }}
          className="absolute rounded-full border-2 border-dashed border-purple-400/60 pointer-events-none"
          style={{ width: size * 1.35, height: size * 1.35 }}
        />
      )}

      {/* Main Glassmorphic Animated Orb */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        animate={
          state === 'LISTENING'
            ? { scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }
            : state === 'THINKING'
            ? { scale: [1, 0.96, 1] }
            : state === 'EXECUTING'
            ? { scale: [1, 1.05, 1] }
            : state === 'SPEAKING'
            ? { scale: [1, 1.06, 0.97, 1.04, 1] }
            : state === 'SUCCESS'
            ? { scale: [1, 1.1, 1] }
            : { y: [0, -6, 0] } // Gentle float when SLEEPING / IDLE
        }
        transition={{
          repeat: Infinity,
          duration:
            state === 'LISTENING'
              ? 1.5
              : state === 'THINKING' || state === 'EXECUTING'
              ? 1.2
              : state === 'SPEAKING'
              ? 1.3
              : 5,
          ease: 'easeInOut',
        }}
        className={`relative rounded-full bg-gradient-to-tr ${theme.core} ${theme.glow} flex items-center justify-center cursor-pointer transition-all duration-500 border-2 ${theme.ring}`}
        style={{ width: size, height: size }}
      >
        {/* Inner Glass Lens Highlight */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-b from-white/25 via-transparent to-transparent pointer-events-none" />

        {/* Center Icon */}
        <div className="relative z-10 flex flex-col items-center justify-center text-white drop-shadow-md">
          <IconComponent
            className={`w-10 h-10 ${
              state === 'THINKING' ? 'animate-spin' : state === 'EXECUTING' ? 'animate-spin-slow' : ''
            }`}
          />
        </div>
      </motion.button>

      {/* Status Label & Privacy Badge */}
      <div className="mt-4 flex flex-col items-center space-y-1.5">
        <span className="text-sm font-medium tracking-wider uppercase text-slate-300 drop-shadow">
          {theme.label}
        </span>

        {state === 'SLEEPING' && (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>🔵 Inactive / Wake Word Active</span>
          </div>
        )}

        {state === 'LISTENING' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>🔴 Microphone Active</span>
          </motion.div>
        )}

        {state === 'EXECUTING' && (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>🟢 Performing Action</span>
          </div>
        )}
      </div>
    </div>
  );
};
