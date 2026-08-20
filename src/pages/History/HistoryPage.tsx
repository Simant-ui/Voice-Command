import React, { useState } from 'react';
import { ChatMessage } from '../../types';
import { Search, Trash2, Clock, MessageSquare, Wrench } from 'lucide-react';

interface HistoryPageProps {
  messages: ChatMessage[];
  onClearHistory: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ messages, onClearHistory }) => {
  const [search, setSearch] = useState('');

  const filteredMessages = messages.filter((m) =>
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            SQLite Conversation History
          </h2>
          <p className="text-xs text-slate-400">Search and review past AI interactions & tool logs</p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold border border-rose-500/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversation history..."
          className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* History Items */}
      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="glass-panel p-8 text-center text-slate-400 text-sm rounded-2xl">
            No matching history records found.
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div key={msg.id} className="glass-panel p-4 rounded-2xl space-y-2 border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span
                  className={`font-semibold px-2 py-0.5 rounded-full uppercase font-mono ${
                    msg.role === 'user' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-indigo-500/20 text-indigo-300'
                  }`}
                >
                  {msg.role}
                </span>
                <span className="text-slate-400 font-mono">
                  {new Date(msg.timestamp).toLocaleString()}
                </span>
              </div>

              <p className="text-sm text-slate-200">{msg.content}</p>

              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs text-cyan-400 font-mono">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Tools: {msg.toolCalls.map((t) => t.name).join(', ')}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
