import React from 'react';
import { Sparkles, Settings, History, Brain, Radio, ShieldCheck, Minimize2, Sun, Moon } from 'lucide-react';
import { platform } from '../../services/platform';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isWakeWordActive: boolean;
  onToggleWakeWord?: () => void;
  themeMode?: 'dark' | 'light' | 'system';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isWakeWordActive,
  onToggleWakeWord,
  themeMode = 'dark',
  onToggleTheme,
}) => {
  const handleMinimizeToTray = async () => {
    await platform.minimizeToTray();
  };

  return (
    <header className="h-16 border-b border-slate-800/80 glass-panel px-6 flex items-center justify-between select-none z-30">
      {/* Brand Title */}
      <div
        onClick={() => setActiveTab('home')}
        className="flex items-center space-x-3 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-slate-100 tracking-tight font-sans">
              Sathi AI
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
              v1.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Windows Desktop Voice Assistant</p>
        </div>
      </div>

      {/* Center Nav Pills */}
      <div className="flex items-center bg-slate-900/70 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'home'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'chat'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          History
        </button>
        <button
          onClick={() => setActiveTab('memory')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'memory'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Memory
        </button>
      </div>

      {/* Right Controls & Status Pill */}
      <div className="flex items-center space-x-3">
        {/* Wake word status pill */}
        <button
          onClick={onToggleWakeWord}
          title={isWakeWordActive ? 'Disable Background Wake Word' : 'Enable Background Wake Word ("Hey Sathi")'}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
            isWakeWordActive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${isWakeWordActive ? 'animate-pulse text-emerald-400' : ''}`} />
          <span>"Hey Sathi"</span>
        </button>

        {/* Theme mode toggle (Dark / Light) */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-300 hover:text-amber-400 transition-colors border border-slate-800"
            title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        )}

        {/* Settings gear */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`p-2 rounded-xl text-slate-300 hover:text-cyan-400 transition-colors border border-slate-800 ${
            activeTab === 'settings' ? 'bg-slate-800 text-cyan-400 border-cyan-500/40' : 'hover:bg-slate-800'
          }`}
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Minimize to tray button */}
        <button
          onClick={handleMinimizeToTray}
          className="p-2 rounded-xl text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors border border-slate-800"
          title="Minimize to System Tray"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
