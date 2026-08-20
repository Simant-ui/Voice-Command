import { AIProvider } from './AIProvider';
import { CloudAIProvider } from './CloudAIProvider';
import { LocalAIProvider } from './LocalAIProvider';
import { AIProviderConfig } from '../../types';

export function createAIProvider(config: AIProviderConfig): AIProvider {
  if (config.provider === 'ollama' || config.type === 'local') {
    return new LocalAIProvider(config);
  }
  return new CloudAIProvider(config);
}

export * from './AIProvider';
export * from './CloudAIProvider';
export * from './LocalAIProvider';
