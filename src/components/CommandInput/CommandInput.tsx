import React, { useState } from 'react';
import { Mic, MicOff, Send, Sparkles, Monitor, Search, Camera, FolderPlus } from 'lucide-react';
import { AssistantState } from '../../types';

interface CommandInputProps {
  onSendMessage: (text: string) => void;
  onToggleVoice: () => void;
  assistantState: AssistantState;
}

export const CommandInput: React.FC<CommandInputProps> = ({
  onSendMessage,
  onToggleVoice,
  assistantState,
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || assistantState === 'THINKING' || assistantState === 'EXECUTING') return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleQuickAction = (actionText: string) => {
    onSendMessage(actionText);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {/* Main Input Box */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-input rounded-2xl p-2 flex items-center shadow-2xl transition-all border border-slate-700/60 focus-within:border-purple-500/80">
          <Sparkles className="w-5 h-5 text-purple-400 ml-3 shrink-0 animate-pulse" />

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={assistantState === 'THINKING' || assistantState === 'EXECUTING'}
            placeholder={
              assistantState === 'LISTENING'
                ? 'Listening... (नेपाली वा English मा बोल्नुहोस्)'
                : assistantState === 'THINKING' || assistantState === 'EXECUTING'
                ? 'Sathi AI working...'
                : 'Ask Sathi or command... (उदा: "Chrome खोल" / "Open Chrome")'
            }
            className="flex-1 bg-transparent px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none text-sm font-medium"
          />

          {/* Voice Microphone Toggle Button */}
          <button
            type="button"
            onClick={onToggleVoice}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 mr-1 ${
              assistantState === 'LISTENING'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-purple-400 border border-slate-700'
            }`}
            title={assistantState === 'LISTENING' ? 'Stop Listening' : 'Start Voice Input (नेपाली / English)'}
          >
            {assistantState === 'LISTENING' ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          {/* Send Text Button */}
          <button
            type="submit"
            disabled={!text.trim() || assistantState === 'THINKING' || assistantState === 'EXECUTING'}
            className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-lg shadow-purple-600/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Quick Action Suggestion Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
        <button
          onClick={() => handleQuickAction('Chrome खोल अनि YouTube मा React tutorial खोज')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full glass-panel-interactive text-slate-300 hover:text-cyan-300"
        >
          <Monitor className="w-3.5 h-3.5 text-cyan-400" />
          <span>Chrome खोल</span>
        </button>

        <button
          onClick={() => handleQuickAction('मेरो Downloads मा भएको assignment खोल')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full glass-panel-interactive text-slate-300 hover:text-cyan-300"
        >
          <Search className="w-3.5 h-3.5 text-indigo-400" />
          <span>फाइल खोज</span>
        </button>

        <button
          onClick={() => handleQuickAction('Screenshot लेऊ')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full glass-panel-interactive text-slate-300 hover:text-cyan-300"
        >
          <Camera className="w-3.5 h-3.5 text-emerald-400" />
          <span>Screenshot</span>
        </button>

        <button
          onClick={() => handleQuickAction('मेरो laptop को CPU usage र battery कति छ?')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full glass-panel-interactive text-slate-300 hover:text-cyan-300"
        >
          <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
          <span>System Specs</span>
        </button>
      </div>
    </div>
  );
};
