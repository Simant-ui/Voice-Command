import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { Bot, User, CheckCircle, AlertCircle, Wrench, Shield, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatViewProps {
  messages: ChatMessage[];
}

export const ChatView: React.FC<ChatViewProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
      {messages.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          No previous messages. Say "Hey Sathi" or type a command to get started.
        </div>
      )}

      {messages.map((msg) => {
        const isUser = msg.role === 'user';

        return (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isUser
                  ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'bg-gradient-to-tr from-cyan-500 to-sky-600 text-white shadow-lg shadow-cyan-500/20'
              }`}
            >
              {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Bubble */}
            <div className="max-w-xl space-y-2">
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  isUser
                    ? 'bg-cyan-600/90 text-white rounded-tr-none shadow-lg'
                    : 'glass-panel text-slate-100 rounded-tl-none border border-slate-700/60'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Timestamp */}
                <div className="mt-1 text-[10px] text-right opacity-60 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {/* Tool Execution Cards attached to message */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="space-y-2 pt-1">
                  {msg.toolCalls.map((tool) => (
                    <div
                      key={tool.id}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-semibold text-cyan-400">
                          <Wrench className="w-3.5 h-3.5" />
                          {tool.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-mono ${
                            tool.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : tool.status === 'failed'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {tool.status}
                        </span>
                      </div>

                      {tool.result?.message && (
                        <p className="text-slate-300 font-mono">{tool.result.message}</p>
                      )}

                      {/* Screenshot Image Preview Card */}
                      {tool.name === 'take_screenshot' && tool.result?.imageUri && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-slate-700">
                          <img
                            src={tool.result.imageUri}
                            alt="Desktop Screenshot"
                            className="w-full h-auto max-h-48 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
