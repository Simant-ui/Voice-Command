import { SearchSource } from './SearchProvider';

export interface CacheEntry {
  query: string;
  sources: SearchSource[];
  summary: string;
  timestamp: number;
  ttlMs: number;
}

export class KnowledgeCache {
  private cache: Map<string, CacheEntry> = new Map();

  // Determine TTL based on question sensitivity (Short for weather/news, medium for tech, long for facts)
  public getFreshnessTTL(query: string): number {
    const q = query.toLowerCase();
    if (q.includes('weather') || q.includes('price') || q.includes('score') || q.includes('news') || q.includes('आज')) {
      return 5 * 60 * 1000; // 5 minutes
    }
    if (q.includes('latest') || q.includes('version') || q.includes('error') || q.includes('2026')) {
      return 60 * 60 * 1000; // 1 hour
    }
    return 24 * 60 * 60 * 1000; // 24 hours
  }

  public get(query: string): CacheEntry | null {
    const key = query.toLowerCase().trim();
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttlMs) {
      this.cache.delete(key);
      return null;
    }
    return entry;
  }

  public set(query: string, sources: SearchSource[], summary: string, customTTL?: number): void {
    const key = query.toLowerCase().trim();
    const ttlMs = customTTL || this.getFreshnessTTL(query);
    this.cache.set(key, {
      query,
      sources,
      summary,
      timestamp: Date.now(),
      ttlMs,
    });
  }

  public clear(): void {
    this.cache.clear();
  }
}

export const knowledgeCache = new KnowledgeCache();
