import { ChatMessage, ToolDefinition, AIProviderConfig } from '../../types';

export interface AIResponseStream {
  text: string;
  isDone: boolean;
  toolCalls?: { name: string; args: Record<string, any> }[];
}

export abstract class AIProvider {
  protected config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  abstract updateConfig(newConfig: Partial<AIProviderConfig>): void;

  abstract sendMessage(
    messages: ChatMessage[],
    tools: ToolDefinition[],
    onChunk?: (chunkText: string) => void
  ): Promise<{ text: string; toolCalls?: { name: string; args: Record<string, any> }[] }>;
}
