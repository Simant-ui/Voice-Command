import { AIProvider } from './AIProvider';
import { ChatMessage, ToolDefinition, AIProviderConfig } from '../../types';

export class LocalAIProvider extends AIProvider {
  constructor(config: AIProviderConfig) {
    super(config);
  }

  updateConfig(newConfig: Partial<AIProviderConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  async sendMessage(
    messages: ChatMessage[],
    tools: ToolDefinition[],
    onChunk?: (chunkText: string) => void
  ): Promise<{ text: string; toolCalls?: { name: string; args: Record<string, any> }[] }> {
    const endpoint = this.config.baseUrl || 'http://localhost:11434/api/chat';
    const model = this.config.model || 'llama3';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Local Ollama endpoint error: ${response.statusText}`);
      }

      const data = await response.json();
      const reply = data.message?.content || 'Local AI processed prompt.';
      if (onChunk) onChunk(reply);

      return { text: reply };
    } catch (err: any) {
      const fallback = `Local AI provider at ${endpoint} is not reachable right now. Make sure Ollama or LM Studio is running locally.`;
      if (onChunk) onChunk(fallback);
      return { text: fallback };
    }
  }
}
