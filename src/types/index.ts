export type AssistantState = 'SLEEPING' | 'IDLE' | 'LISTENING' | 'THINKING' | 'EXECUTING' | 'SPEAKING' | 'SUCCESS' | 'ERROR';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
  riskLevel: RiskLevel;
  status: 'pending' | 'confirmed' | 'executing' | 'completed' | 'failed' | 'cancelled';
  result?: any;
  error?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  toolCalls?: ToolCall[];
  isStreaming?: boolean;
}

export interface ToolDefinition {
  name: string;
  description: string;
  riskLevel: RiskLevel;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required?: string[];
  };
}

export type AIProviderType = 'cloud' | 'local';

export interface AIProviderConfig {
  type: AIProviderType;
  provider: 'openrouter' | 'openai' | 'gemini' | 'ollama' | 'local';
  apiKey: string;
  model: string;
  baseUrl?: string;
  temperature: number;
  maxTokens?: number;
}

export interface UserSettings {
  themeMode: 'dark' | 'light' | 'system';
  // General
  startWithWindows: boolean;
  minimizeToTray: boolean;
  launchAtStartup: boolean;
  
  // Voice & Language
  assistantLanguage: 'auto' | 'ne' | 'en';
  voiceLanguage: 'auto' | 'ne-NP' | 'en-US';
  wakeWordEnabled: boolean;
  wakePhrase: string;
  followUpListening: boolean;
  followUpTimeoutSeconds: number;
  microphoneDevice: string;
  ttsVoice: string;
  ttsRate: number;
  autoSpeak: boolean;
  
  // AI
  aiProvider: 'openrouter' | 'openai' | 'gemini' | 'ollama';
  aiModel: string;
  apiKey: string;
  temperature: number;
  streaming: boolean;
  
  // Privacy
  saveConversations: boolean;
  saveMemory: boolean;
  voiceHistory: boolean;
  telemetry: boolean;
}

export interface MemoryItem {
  id: string;
  category: 'Personal Preferences' | 'Applications' | 'Projects' | 'Important Information' | 'Custom Instructions';
  key: string;
  value: string;
  updatedAt: number;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  actionName: string;
  category: 'app' | 'filesystem' | 'system' | 'web' | 'media';
  riskLevel: RiskLevel;
  status: 'executed' | 'blocked' | 'cancelled';
  details: string;
}

export interface PendingAction {
  toolCall: ToolCall;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface SystemInfo {
  os: string;
  arch: string;
  hostname: string;
  cpuModel: string;
  cpuUsage: number;
  memoryTotalGB: number;
  memoryUsedGB: number;
  batteryPercentage?: number;
  isCharging?: boolean;
}
