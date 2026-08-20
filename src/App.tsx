import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Navigation/Header';
import { Sidebar } from './components/Navigation/Sidebar';
import { FloatingMiniOrb } from './components/FloatingMiniOrb/FloatingMiniOrb';
import { HomePage } from './pages/Home/HomePage';
import { ChatPage } from './pages/Chat/ChatPage';
import { HistoryPage } from './pages/History/HistoryPage';
import { ActionsPage } from './pages/Actions/ActionsPage';
import { MemoryPage } from './pages/Memory/MemoryPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { DangerousActionModal } from './components/DangerousActionModal/DangerousActionModal';

import {
  AssistantState,
  ChatMessage,
  UserSettings,
  MemoryItem,
  PendingAction,
  ToolCall,
} from './types';
import { dbService } from './services/db/DatabaseService';
import { createAIProvider, AIProvider } from './services/ai';
import { SYSTEM_TOOLS, toolExecutor } from './services/tools';
import { securityManager } from './services/security/SecurityManager';
import { voiceService } from './services/voice/VoiceService';
import { wakeWordEngine } from './services/voice/WakeWordEngine';
import { agentPlanner, PlannedStep } from './services/agent/AgentPlanner';
import { researchAgent, ResearchResult } from './services/research/ResearchAgent';
import { ResearchProgressCard } from './components/ResearchProgressCard/ResearchProgressCard';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  // Default state is SLEEPING (🔵 Inactive)
  const [assistantState, setAssistantState] = useState<AssistantState>('SLEEPING');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [memoryItems, setMemoryItems] = useState<MemoryItem[]>([]);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [wakeWordActive, setWakeWordActive] = useState<boolean>(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMiniMode, setIsMiniMode] = useState<boolean>(false);

  // Planned step pipeline & research state for live UI feedback
  const [plannedSteps, setPlannedSteps] = useState<PlannedStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [researchStage, setResearchStage] = useState<string>('');

  const aiProviderRef = useRef<AIProvider | null>(null);
  const followUpTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize SQLite database, settings, and memory on startup
  useEffect(() => {
    async function initApp() {
      await dbService.init();
      const loadedSettings = await dbService.getSettings();
      const loadedHistory = await dbService.getConversationHistory();
      const loadedMemory = await dbService.getMemoryItems();

      setSettings(loadedSettings);
      setMessages(loadedHistory);
      setMemoryItems(loadedMemory);
      setWakeWordActive(loadedSettings.wakeWordEnabled);

      aiProviderRef.current = createAIProvider({
        type: loadedSettings.aiProvider === 'ollama' ? 'local' : 'cloud',
        provider: loadedSettings.aiProvider,
        apiKey: loadedSettings.apiKey,
        model: loadedSettings.aiModel,
        temperature: loadedSettings.temperature,
      });

      // Start continuous background wake word engine if enabled
      if (loadedSettings.wakeWordEnabled) {
        wakeWordEngine.setWakePhrase(loadedSettings.wakePhrase || 'hey sathi');
        wakeWordEngine.start(() => {
          handleWakeWordTriggered(loadedSettings);
        });
      }
    }

    initApp();
  }, []);

  // Clear follow-up timeout
  const clearFollowUpTimer = () => {
    if (followUpTimerRef.current) {
      clearTimeout(followUpTimerRef.current);
      followUpTimerRef.current = null;
    }
  };

  // Start follow-up listening timer before returning to SLEEPING
  const scheduleSleepTimeout = (timeoutSeconds: number = 8) => {
    clearFollowUpTimer();
    followUpTimerRef.current = setTimeout(() => {
      console.log('[Sathi AI] Follow-up window expired. Returning to SLEEPING mode.');
      voiceService.stopListening();
      setAssistantState('SLEEPING');
    }, timeoutSeconds * 1000);
  };

  // Triggered STRICTLY when "Hey Sathi" is detected by local wake word engine
  const handleWakeWordTriggered = (currentSettings: UserSettings | null) => {
    clearFollowUpTimer();
    console.log('[Sathi AI] "Hey Sathi" Wake-Word detected! Waking assistant...');

    const isEnglishOnly = currentSettings?.assistantLanguage === 'en';
    const greetingText = isEnglishOnly
      ? "Hi, I'm your assistant. How can I help you?"
      : 'नमस्ते! म तपाईंको साथी AI हुँ। म कसरी सहयोग गर्न सक्छु?';

    setAssistantState('SPEAKING');
    voiceService.speak(
      greetingText,
      () => {
        // After speaking greeting, transition to LISTENING for the command
        startListeningForCommand(currentSettings);
      },
      currentSettings?.ttsRate || 1.0,
      'ne-NP'
    );
  };

  // Start active command listening (🔴 Mic Active)
  const startListeningForCommand = (currentSettings: UserSettings | null) => {
    setAssistantState('LISTENING');
    voiceService.startListening(
      (transcript) => {
        clearFollowUpTimer();
        setAssistantState('THINKING');
        handleSendMessage(transcript);
      },
      (isListening) => {
        if (!isListening && assistantState === 'LISTENING') {
          // Silent timeout during listening -> return to SLEEPING
          scheduleSleepTimeout(currentSettings?.followUpTimeoutSeconds || 8);
        }
      },
      (err) => {
        console.warn('Voice error:', err);
        setAssistantState('ERROR');
        setTimeout(() => setAssistantState('SLEEPING'), 2000);
      },
      currentSettings?.voiceLanguage
    );
  };

  // Global Keyboard Shortcuts (Ctrl+Space, Ctrl+Shift+Space, Esc, Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Space -> Open Home tab / Restore Mini Mode
      if (e.ctrlKey && !e.shiftKey && e.code === 'Space') {
        e.preventDefault();
        setIsMiniMode(false);
        setActiveTab('home');
      }
      // Ctrl + Shift + Space -> Wake Assistant
      if (e.ctrlKey && e.shiftKey && e.code === 'Space') {
        e.preventDefault();
        handleWakeWordTriggered(settings);
      }
      // Esc -> Stop & return to SLEEPING
      if (e.key === 'Escape') {
        clearFollowUpTimer();
        voiceService.stopListening();
        voiceService.stopSpeaking();
        setAssistantState('SLEEPING');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings, assistantState]);

  // Sync Dark / Light mode class on root element
  useEffect(() => {
    if (!settings) return;
    if (settings.themeMode === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [settings?.themeMode]);

  const handleToggleWakeWord = async () => {
    if (!settings) return;
    const nextState = !wakeWordActive;
    setWakeWordActive(nextState);

    if (nextState) {
      wakeWordEngine.setWakePhrase(settings.wakePhrase || 'hey sathi');
      wakeWordEngine.start(() => {
        handleWakeWordTriggered(settings);
      });
    } else {
      wakeWordEngine.stop();
    }

    const newSettings = { ...settings, wakeWordEnabled: nextState };
    setSettings(newSettings);
    await dbService.saveSettings(newSettings);
  };

  // Sync settings updates
  const handleSaveSettings = async (newSettings: UserSettings) => {
    setSettings(newSettings);
    await dbService.saveSettings(newSettings);

    if (aiProviderRef.current) {
      aiProviderRef.current.updateConfig({
        provider: newSettings.aiProvider,
        apiKey: newSettings.apiKey,
        model: newSettings.aiModel,
        temperature: newSettings.temperature,
      });
    }
  };

  // Memory operations
  const handleAddMemory = async (item: Omit<MemoryItem, 'id' | 'updatedAt'>) => {
    const saved = await dbService.saveMemoryItem(item);
    setMemoryItems((prev) => [saved, ...prev]);
  };

  const handleDeleteMemory = async (id: string) => {
    await dbService.deleteMemoryItem(id);
    setMemoryItems((prev) => prev.filter((m) => m.id !== id));
  };

  const handleClearAllMemory = async () => {
    await dbService.clearAllMemory();
    setMemoryItems([]);
  };

  // Clear Chat History
  const handleClearHistory = async () => {
    await dbService.clearConversationHistory();
    setMessages([]);
  };

  // Main Command Handler (Text or Voice)
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || assistantState === 'THINKING' || assistantState === 'EXECUTING') return;

    clearFollowUpTimer();

    // Create User Message
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    await dbService.saveConversationHistory(updatedMessages);

    // Check if AgentPlanner can break prompt into multi-step execution pipeline
    const multiSteps = agentPlanner.planTask(text);
    if (multiSteps.length > 0) {
      setPlannedSteps(multiSteps);
      setCurrentStepIndex(0);
      setAssistantState('EXECUTING');

      for (let i = 0; i < multiSteps.length; i++) {
        setCurrentStepIndex(i);
        const step = multiSteps[i];
        const tc: ToolCall = {
          id: 'tc_step_' + Date.now() + '_' + i,
          name: step.toolName,
          args: step.args,
          riskLevel: securityManager.evaluateRisk({
            id: '',
            name: step.toolName,
            args: step.args,
            riskLevel: 'LOW',
            status: 'pending',
          }),
          status: 'pending',
        };
        await executeTool(tc, userMsg.id);
      }

      setAssistantState('SUCCESS');
      setTimeout(() => {
        setPlannedSteps([]);
        // Enter follow-up listening mode or return to SLEEPING after timeout
        if (settings?.followUpListening) {
          startListeningForCommand(settings);
        } else {
          setAssistantState('SLEEPING');
        }
      }, 2500);
      return;
    }

    // Default AI Agent Execution
    setAssistantState('THINKING');

    try {
      const provider = aiProviderRef.current;
      if (!provider) throw new Error('AI Provider not initialized');

      // Call AI Provider
      const result = await provider.sendMessage(updatedMessages, SYSTEM_TOOLS);

      // Create Assistant Message
      const assistantMsg: ChatMessage = {
        id: 'msg_ast_' + Date.now(),
        role: 'assistant',
        content: result.text,
        timestamp: Date.now(),
        toolCalls: result.toolCalls?.map((tc) => ({
          id: 'tc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          name: tc.name,
          args: tc.args,
          riskLevel: securityManager.evaluateRisk({
            id: '',
            name: tc.name,
            args: tc.args,
            riskLevel: 'LOW',
            status: 'pending',
          }),
          status: 'pending',
        })),
      };

      const withAssistantMessages = [...updatedMessages, assistantMsg];
      setMessages(withAssistantMessages);
      await dbService.saveConversationHistory(withAssistantMessages);

      // Handle Tool Execution or TTS Speaking
      if (assistantMsg.toolCalls && assistantMsg.toolCalls.length > 0) {
        for (const tc of assistantMsg.toolCalls) {
          await processToolCall(tc, assistantMsg.id);
        }
      } else {
        // Speak response if autoSpeak enabled
        if (settings?.autoSpeak) {
          setAssistantState('SPEAKING');
          voiceService.speak(
            result.text,
            () => {
              if (settings?.followUpListening) {
                startListeningForCommand(settings);
              } else {
                setAssistantState('SLEEPING');
              }
            },
            settings.ttsRate
          );
        } else {
          if (settings?.followUpListening) {
            startListeningForCommand(settings);
          } else {
            setAssistantState('SLEEPING');
          }
        }
      }
    } catch (err: any) {
      console.error('Error handling message:', err);
      setAssistantState('ERROR');
      const errorMsg: ChatMessage = {
        id: 'msg_err_' + Date.now(),
        role: 'assistant',
        content: `I ran into an issue: ${err.message || String(err)}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setTimeout(() => setAssistantState('SLEEPING'), 3000);
    }
  };

  // Process Tool Call with Risk Protection
  const processToolCall = async (toolCall: ToolCall, msgId: string) => {
    const risk = securityManager.evaluateRisk(toolCall);

    if (risk === 'MEDIUM' || risk === 'HIGH') {
      setPendingAction({
        toolCall,
        onConfirm: async () => {
          setPendingAction(null);
          await executeTool(toolCall, msgId);
        },
        onCancel: () => {
          setPendingAction(null);
          securityManager.logAction(toolCall, 'cancelled', 'User cancelled action in modal');
          setAssistantState('SLEEPING');
        },
      });
    } else {
      await executeTool(toolCall, msgId);
    }
  };

  const executeTool = async (toolCall: ToolCall, msgId: string) => {
    setAssistantState('EXECUTING');
    const execRes = await toolExecutor.execute(toolCall);

    securityManager.logAction(
      toolCall,
      execRes.success ? 'executed' : 'blocked',
      execRes.message
    );

    // Update tool status in messages
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === msgId && msg.toolCalls) {
          return {
            ...msg,
            toolCalls: msg.toolCalls.map((tc) =>
              tc.name === toolCall.name
                ? { ...tc, status: execRes.success ? 'completed' : 'failed', result: execRes }
                : tc
            ),
          };
        }
        return msg;
      })
    );

    // Speak tool completion
    if (settings?.autoSpeak) {
      setAssistantState('SPEAKING');
      voiceService.speak(
        execRes.message,
        () => {
          if (settings?.followUpListening) {
            startListeningForCommand(settings);
          } else {
            setAssistantState('SLEEPING');
          }
        },
        settings.ttsRate
      );
    } else {
      if (settings?.followUpListening) {
        startListeningForCommand(settings);
      } else {
        setAssistantState('SLEEPING');
      }
    }
  };

  // Strict Wake Word Only Mode: Clicking will STOP active sessions, but NEVER wake Sathi from SLEEPING state
  const handleToggleVoice = () => {
    if (assistantState === 'SLEEPING') {
      console.log('[Sathi AI] Manual click activation disabled. Say "Hey Sathi" or "साथी सुन" to wake.');
      // Do nothing — strictly wake-word only!
      return;
    } else {
      clearFollowUpTimer();
      voiceService.stopListening();
      voiceService.stopSpeaking();
      setAssistantState('SLEEPING');
    }
  };

  const handleOrbClick = () => {
    if (assistantState === 'SLEEPING') {
      console.log('[Sathi AI] Orb click: Say "Hey Sathi" or "साथी सुन" to activate.');
    } else {
      handleToggleVoice();
    }
  };

  if (!settings) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#07090D] text-purple-400 select-none">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <span className="font-semibold text-sm">Initializing Sathi AI Engine...</span>
        </div>
      </div>
    );
  }

  // Floating Mini Mode View
  if (isMiniMode) {
    return (
      <FloatingMiniOrb
        state={assistantState}
        onToggleVoice={handleToggleVoice}
        onRestoreWindow={() => setIsMiniMode(false)}
      />
    );
  }

  const handleToggleTheme = async () => {
    if (!settings) return;
    const nextTheme: 'dark' | 'light' = settings.themeMode === 'dark' ? 'light' : 'dark';
    const updated: UserSettings = { ...settings, themeMode: nextTheme };
    setSettings(updated);
    await dbService.saveSettings(updated);
  };

  const isNepaliMode = settings.assistantLanguage === 'ne';

  return (
    <div className="h-screen w-screen flex bg-[#07090D] text-slate-100 overflow-hidden font-sans">
      {/* Minimal Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isNepali={isNepaliMode}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header Navigation */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isWakeWordActive={wakeWordActive}
          onToggleWakeWord={handleToggleWakeWord}
          themeMode={settings.themeMode}
          onToggleTheme={handleToggleTheme}
        />

        {/* Main Content View */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'home' && (
            <HomePage
              assistantState={assistantState}
              plannedSteps={plannedSteps}
              currentStepIndex={currentStepIndex}
              onOrbClick={handleOrbClick}
              onSendMessage={handleSendMessage}
              onToggleVoice={handleToggleVoice}
              onNavigateTab={setActiveTab}
              isNepali={isNepaliMode}
            />
          )}

          {activeTab === 'chat' && (
            <ChatPage
              messages={messages}
              assistantState={assistantState}
              onSendMessage={handleSendMessage}
              onToggleVoice={handleToggleVoice}
              onClearHistory={handleClearHistory}
            />
          )}

          {activeTab === 'history' && (
            <HistoryPage messages={messages} onClearHistory={handleClearHistory} />
          )}

          {activeTab === 'actions' && <ActionsPage />}

          {activeTab === 'memory' && (
            <MemoryPage
              memoryItems={memoryItems}
              onAddMemory={handleAddMemory}
              onDeleteMemory={handleDeleteMemory}
              onClearAllMemory={handleClearAllMemory}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage settings={settings} onSaveSettings={handleSaveSettings} />
          )}
        </main>

        {/* Dangerous Action Confirmation Modal */}
        <DangerousActionModal pendingAction={pendingAction} />
      </div>
    </div>
  );
};

export default App;
