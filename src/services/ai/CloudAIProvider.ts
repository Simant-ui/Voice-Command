import { AIProvider } from './AIProvider';
import { ChatMessage, ToolDefinition, AIProviderConfig } from '../../types';
import { agentPlanner, PlannedStep } from '../agent/AgentPlanner';

export class CloudAIProvider extends AIProvider {
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
    const apiKey = this.config.apiKey?.trim();

    // If API key is provided, use Cloud API (OpenRouter/OpenAI compatible)
    if (apiKey) {
      try {
        const formattedTools = tools.map((t) => ({
          type: 'function',
          function: {
            name: t.name,
            description: t.description,
            parameters: t.parameters,
          },
        }));

        const systemMessage = {
          role: 'system',
          content: `You are Sathi AI, an advanced, highly intelligent multi-lingual device-aware AI Desktop & Voice Assistant. You fully understand and speak English, Nepali (नेपाली), and mixed Nepali-English (Nepanglish).

Core Execution Principle:
- USER SPEAKS/ASKS -> YOU UNDERSTAND -> YOU INSPECT THE CURRENT DEVICE -> YOU EXECUTE THE ACTION -> YOU VERIFY RESULT -> YOU RESPOND.
- Do NOT simply explain how the user can perform an action if you have a tool to perform it. Execute the tool!

Language & Dialogue Rules:
- Detect the user's language automatically (English, Nepali, or Nepanglish).
- Always respond in the EXACT same language used by the user.
- When responding in Nepali, be polite, respectful, and natural using 'हजुर' (e.g. 'हुन्छ हजुर, Chrome खोल्दैछु।', 'Chrome खोलिदिएँ हजुर।', 'हजुर, पक्कै पनि। तपाईं मसँग नेपालीमै कुरा गर्न सक्नुहुन्छ।').
- Keep common technical terms in natural English or Nepanglish (Chrome, VS Code, Browser, Screenshot, CPU, RAM, Folder, File, YouTube, Battery, Download).
- Support context references like 'त्यसमा' (in that application), 'त्यो' (that file), 'अब' (current action context).`,
        };

        const apiMessages = [
          systemMessage,
          ...messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ];

        let endpoint = this.config.baseUrl;
        let headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (this.config.provider === 'gemini') {
          endpoint = endpoint || 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
          headers['Authorization'] = `Bearer ${apiKey}`;
        } else if (this.config.provider === 'openai') {
          endpoint = endpoint || 'https://api.openai.com/v1/chat/completions';
          headers['Authorization'] = `Bearer ${apiKey}`;
        } else {
          // Default to OpenRouter
          endpoint = endpoint || 'https://openrouter.ai/api/v1/chat/completions';
          headers['Authorization'] = `Bearer ${apiKey}`;
          headers['HTTP-Referer'] = 'https://sathi-ai.desktop';
          headers['X-Title'] = 'Sathi AI Desktop Assistant';
        }

        const modelName = this.config.provider === 'gemini' 
          ? (this.config.model && this.config.model.startsWith('gemini') ? this.config.model : 'gemini-2.0-flash')
          : (this.config.model || 'openai/gpt-4o-mini');

        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: modelName,
            messages: apiMessages,
            tools: formattedTools.length > 0 ? formattedTools : undefined,
            temperature: this.config.temperature ?? 0.7,
            stream: false,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`AI API request failed (${response.status}): ${errText}`);
        }

        const data = await response.json();
        const choice = data.choices?.[0]?.message;

        if (choice) {
          const text = choice.content || '';
          if (onChunk && text) onChunk(text);

          const toolCalls = choice.tool_calls?.map((tc: any) => {
            let parsedArgs = {};
            try {
              parsedArgs = JSON.parse(tc.function.arguments || '{}');
            } catch {
              parsedArgs = {};
            }
            return {
              name: tc.function.name,
              args: parsedArgs,
            };
          });

          return { text, toolCalls };
        }
      } catch (err: any) {
        console.warn('Cloud API Error, falling back to local heuristic intent parser:', err);
      }
    }

    // Heuristic Intent Parser fallback (Nepali, English & Nepanglish) using AgentPlanner
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    const plannedSteps = agentPlanner.planTask(lastUserMsg);

    if (plannedSteps.length > 0) {
      const isNepali = /[\u0900-\u097F]/.test(lastUserMsg);
      const responseText = isNepali
        ? `हुन्छ हजुर, ${plannedSteps[0].description}।`
        : `Sure, ${plannedSteps[0].description}.`;

      if (onChunk) onChunk(responseText);

      return {
        text: responseText,
        toolCalls: plannedSteps.map((s: PlannedStep) => ({
          name: s.toolName,
          args: s.args,
        })),
      };
    }

    // Default conversational AI response
    const defaultResponse = `I received your message: "${lastUserMsg}". You can give voice or text commands like "Chrome खोल", "Take screenshot", "Volume 50%", "Battery status", or "YouTube खोल".`;
    if (onChunk) onChunk(defaultResponse);
    return { text: defaultResponse };
  }
}
