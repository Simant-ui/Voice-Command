import React from 'react';
import { Home, MessageSquare, Zap, Brain, Settings, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isNepali: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isNepali,
}) => {
  const navItems = [
    { id: 'home', label: isNepali ? 'गृहपृष्ठ' : 'Home', icon: Home },
    { id: 'chat', label: isNepali ? 'कुराकानी' : 'Conversations', icon: MessageSquare },
    { id: 'actions', label: isNepali ? 'कार्यहरू' : 'Recent Actions', icon: Zap },
    { id: 'memory', label: isNepali ? 'स्मृति' : 'Memory', icon: Brain },
    { id: 'settings', label: isNepali ? 'सेटिङहरू' : 'Settings', icon: Settings },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 70 : 220 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="h-full glass-panel border-r border-white/10 flex flex-col justify-between p-3 z-40 select-none relative shrink-0"
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-base text-slate-100 tracking-tight whitespace-nowrap font-sans">
                Sathi AI
              </span>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/90 to-blue-600/90 text-white shadow-lg shadow-purple-600/20 border border-purple-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                title={item.label}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer info */}
      {!isCollapsed && (
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between font-mono">
            <span>Status</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Online
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">Shortcuts: Ctrl+Space</p>
        </div>
      )}
    </motion.aside>
  );
};
