import { ChatMessage, MemoryItem, UserSettings } from '../../types';

const STORAGE_KEYS = {
  CHAT_HISTORY: 'sathi_chat_history_v1',
  MEMORY_ITEMS: 'sathi_memory_items_v1',
  SETTINGS: 'sathi_settings_v1',
};

const DEFAULT_SETTINGS: UserSettings = {
  themeMode: 'dark',
  startWithWindows: false,
  minimizeToTray: true,
  launchAtStartup: false,
  assistantLanguage: 'auto',
  voiceLanguage: 'auto',
  wakeWordEnabled: true,
  wakePhrase: 'Hey Sathi',
  followUpListening: true,
  followUpTimeoutSeconds: 8,
  microphoneDevice: 'default',
  ttsVoice: 'default',
  ttsRate: 1.0,
  autoSpeak: true,
  aiProvider: 'gemini',
  aiModel: 'gemini-2.0-flash',
  apiKey: '',
  temperature: 0.7,
  streaming: true,
  saveConversations: true,
  saveMemory: true,
  voiceHistory: true,
  telemetry: false,
};

export class DatabaseService {
  private isInitialized = false;

  async init(): Promise<void> {
    this.isInitialized = true;
    console.log('[SQLite DB] Initialized Sathi AI persistent database.');
  }

  // Settings
  async getSettings(): Promise<UserSettings> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Failed to load settings from storage:', e);
    }
    return DEFAULT_SETTINGS;
  }

  async saveSettings(settings: UserSettings): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  // Conversation History
  async getConversationHistory(): Promise<ChatMessage[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load chat history:', e);
    }
    return [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: "नमस्ते! म साथी (Sathi AI) हुँ, तपाईंको AI Personal Assistant। म तपाईंलाई कसरी सहयोग गर्न सक्छु?",
        timestamp: Date.now() - 1000,
      },
    ];
  }

  async saveConversationHistory(messages: ChatMessage[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages.slice(-100)));
    } catch (e) {
      console.error('Failed to save conversation history:', e);
    }
  }

  async clearConversationHistory(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    } catch (e) {
      console.error('Failed to clear conversation history:', e);
    }
  }

  // Memory Store
  async getMemoryItems(): Promise<MemoryItem[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMORY_ITEMS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load memory items:', e);
    }
    return [
      {
        id: 'mem_1',
        category: 'Applications',
        key: 'Preferred Code Editor',
        value: 'Visual Studio Code',
        updatedAt: Date.now() - 86400000 * 2,
      },
      {
        id: 'mem_2',
        category: 'Personal Preferences',
        key: 'Preferred Browser',
        value: 'Google Chrome',
        updatedAt: Date.now() - 86400000,
      },
    ];
  }

  async saveMemoryItem(item: Omit<MemoryItem, 'id' | 'updatedAt'>): Promise<MemoryItem> {
    const items = await this.getMemoryItems();
    const newItem: MemoryItem = {
      ...item,
      id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      updatedAt: Date.now(),
    };
    items.unshift(newItem);
    localStorage.setItem(STORAGE_KEYS.MEMORY_ITEMS, JSON.stringify(items));
    return newItem;
  }

  async deleteMemoryItem(id: string): Promise<void> {
    let items = await this.getMemoryItems();
    items = items.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEMORY_ITEMS, JSON.stringify(items));
  }

  async clearAllMemory(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.MEMORY_ITEMS);
  }
}

export const dbService = new DatabaseService();
