import React from 'react';
import { ChatView } from '../../components/Chat/ChatView';
import { CommandInput } from '../../components/CommandInput/CommandInput';
import { ChatMessage, AssistantState } from '../../types';
import { Trash2 } from 'lucide-react';

interface ChatPageProps {
  messages: ChatMessage[];
  assistantState: AssistantState;
  onSendMessage: (text: string) => void;
  onToggleVoice: () => void;
  onClearHistory: () => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  messages,
  assistantState,
  onSendMessage,
  onToggleVoice,
  onClearHistory,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-4">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3 px-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-base font-bold text-slate-100">Live AI Conversation</h2>
          <p className="text-xs text-slate-400">Execute tools, speak commands, or ask questions</p>
        </div>

        <button
          onClick={onClearHistory}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 text-xs transition-colors border border-slate-700"
          title="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Session</span>
        </button>
      </div>

      {/* Message List Stream */}
      <ChatView messages={messages} />

      {/* Bottom Command Input */}
      <div className="pt-3 border-t border-slate-800/80 max-w-4xl mx-auto w-full">
        <CommandInput
          onSendMessage={onSendMessage}
          onToggleVoice={onToggleVoice}
          assistantState={assistantState}
        />
      </div>
    </div>
  );
};
