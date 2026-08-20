import React from 'react';
import { NovaOrb } from '../../components/NovaOrb/NovaOrb';
import { CommandInput } from '../../components/CommandInput/CommandInput';
import { LiveActionCard } from '../../components/LiveActionCard/LiveActionCard';
import { AssistantState } from '../../types';
import { PlannedStep } from '../../services/agent/AgentPlanner';
import { Globe, Folder, Camera, Monitor, Music, Settings, Sparkles } from 'lucide-react';

interface HomePageProps {
  assistantState: AssistantState;
  plannedSteps: PlannedStep[];
  currentStepIndex: number;
  onOrbClick: () => void;
  onSendMessage: (text: string) => void;
  onToggleVoice: () => void;
  onNavigateTab: (tab: string) => void;
  isNepali?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  assistantState,
  plannedSteps,
  currentStepIndex,
  onOrbClick,
  onSendMessage,
  onToggleVoice,
  onNavigateTab,
  isNepali = false,
}) => {
  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (isNepali) {
      if (hour < 12) return 'शुभ बिहानी, सन्तोष';
      if (hour < 17) return 'शुभ अपरान्ह, सन्तोष';
      return 'शुभ साँझ, सन्तोष';
    } else {
      if (hour < 12) return 'Good morning, Santosh';
      if (hour < 17) return 'Good afternoon, Santosh';
      return 'Good evening, Santosh';
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-6 max-w-4xl mx-auto w-full select-none">
      {/* Top Welcome Title */}
      <div className="text-center pt-2 space-y-1">
        <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans">
          {getGreeting()}
        </h2>
        <p className="text-sm text-slate-400">
          {isNepali
            ? 'आज म तपाईंलाई कसरी सहयोग गर्न सक्छु?'
            : 'How can I help you today?'}
        </p>
      </div>

      {/* Central Interactive Orb & Live Execution Pipeline */}
      <div className="py-4 flex flex-col items-center justify-center space-y-4 w-full">
        <NovaOrb state={assistantState} onClick={onOrbClick} size={190} />

        {/* Live Action Execution Pipeline Card */}
        {plannedSteps && plannedSteps.length > 0 && (
          <LiveActionCard
            steps={plannedSteps}
            currentStepIndex={currentStepIndex}
            isCompleted={assistantState === 'SUCCESS'}
          />
        )}
      </div>

      {/* Command Input Box & Quick Action Buttons */}
      <div className="w-full space-y-5">
        <CommandInput
          onSendMessage={onSendMessage}
          onToggleVoice={onToggleVoice}
          assistantState={assistantState}
        />

        {/* Quick Action Grid */}
        <div className="pt-1">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <button
              onClick={() => onSendMessage('Search web for React tutorials')}
              className="glass-panel-interactive p-3 rounded-2xl flex flex-col items-center space-y-2 text-slate-200"
            >
              <Globe className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-medium">Search</span>
            </button>

            <button
              onClick={() => onSendMessage('Search files for project')}
              className="glass-panel-interactive p-3 rounded-2xl flex flex-col items-center space-y-2 text-slate-200"
            >
              <Folder className="w-5 h-5 text-purple-400" />
              <span className="text-xs font-medium">Files</span>
            </button>

            <button
              onClick={() => onSendMessage('Take screenshot')}
              className="glass-panel-interactive p-3 rounded-2xl flex flex-col items-center space-y-2 text-slate-200"
            >
              <Camera className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-medium">Screenshot</span>
            </button>

            <button
              onClick={() => onSendMessage('Open Chrome')}
              className="glass-panel-interactive p-3 rounded-2xl flex flex-col items-center space-y-2 text-slate-200"
            >
              <Monitor className="w-5 h-5 text-sky-400" />
              <span className="text-xs font-medium">Apps</span>
            </button>

            <button
              onClick={() => onSendMessage('Open YouTube')}
              className="glass-panel-interactive p-3 rounded-2xl flex flex-col items-center space-y-2 text-slate-200"
            >
              <Music className="w-5 h-5 text-rose-400" />
              <span className="text-xs font-medium">Music</span>
            </button>

            <button
              onClick={() => onNavigateTab('settings')}
              className="glass-panel-interactive p-3 rounded-2xl flex flex-col items-center space-y-2 text-slate-200"
            >
              <Settings className="w-5 h-5 text-slate-400" />
              <span className="text-xs font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
