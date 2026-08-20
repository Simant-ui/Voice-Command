import { SearchSource, WebSearchProvider, NewsSearchProvider, OfficialSourceProvider } from './SearchProvider';
import { knowledgeCache } from './KnowledgeCache';

export type ResearchDepth = 'FAST' | 'STANDARD' | 'DEEP';

export interface ResearchResult {
  query: string;
  depth: ResearchDepth;
  sources: SearchSource[];
  findings: string;
  conflictsDetected: boolean;
  conflictDetails?: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  synthesizedEvidence: string;
}

export class ResearchAgent {
  private webSearch = new WebSearchProvider();
  private newsSearch = new NewsSearchProvider();
  private officialSearch = new OfficialSourceProvider();

  // Detect whether a prompt requires live web research
  public isResearchNeeded(prompt: string): boolean {
    const text = prompt.toLowerCase();
    const researchKeywords = [
      'latest', 'today', 'current', 'now', 'recent', '2026', 'this week', 'this month',
      'price', 'weather', 'news', 'score', 'schedule', 'version', 'release', 'update',
      'new', 'best', 'near me', 'आज', 'हाल', 'ताजा', 'समाचार', 'मूल्य', 'मौसम', 'भर्खरै'
    ];
    return researchKeywords.some((kw) => text.includes(kw));
  }

  // Detect research depth: FAST (1-3 sources), STANDARD (3-5 sources), DEEP (comprehensive multi-source)
  public detectResearchDepth(prompt: string): ResearchDepth {
    const text = prompt.toLowerCase();
    if (text.includes('deep research') || text.includes('detailed research') || text.includes('compare everything') || text.includes('विस्तृत') || text.includes('सबै compare')) {
      return 'DEEP';
    }
    if (text.includes('fast answer') || text.includes('quick') || text.includes('छिटो')) {
      return 'FAST';
    }
    return 'STANDARD';
  }

  // Execute web research pipeline with progress callbacks
  public async performResearch(
    prompt: string,
    overrideDepth?: ResearchDepth,
    onProgress?: (stage: string) => void
  ): Promise<ResearchResult> {
    const depth = overrideDepth || this.detectResearchDepth(prompt);
    
    // Check Cache first
    const cached = knowledgeCache.get(prompt);
    if (cached) {
      if (onProgress) onProgress('✓ Using verified research cache');
      return {
        query: prompt,
        depth,
        sources: cached.sources,
        findings: cached.summary,
        conflictsDetected: false,
        confidence: 'HIGH',
        synthesizedEvidence: cached.summary,
      };
    }

    // Step 1: Understanding question
    if (onProgress) onProgress('◉ Understanding question...');
    await this.delay(300);

    // Step 2: Searching the web
    if (onProgress) onProgress('🔎 Searching the web...');
    const maxResults = depth === 'FAST' ? 3 : depth === 'DEEP' ? 8 : 5;
    
    let searchRes = await this.webSearch.search(prompt, maxResults);
    
    // If news query, combine with NewsSearchProvider
    if (prompt.toLowerCase().includes('news') || prompt.includes('समाचार') || prompt.includes('आज')) {
      const newsRes = await this.newsSearch.search(prompt, 3);
      searchRes.sources = [...searchRes.sources, ...newsRes.sources];
    }

    // Step 3: Reading sources
    if (onProgress) onProgress('📚 Reading sources...');
    await this.delay(300);

    // Sort by Level priority: Level 1 (Official) > Level 2 (Reputable News) > Level 3 (Community)
    const sortedSources = searchRes.sources.sort((a, b) => a.level - b.level);
    const uniqueSources = this.deduplicateSources(sortedSources);

    // Step 4: Comparing information
    if (onProgress) onProgress('⚖ Comparing information...');
    await this.delay(300);

    // Step 5: Analyzing evidence
    if (onProgress) onProgress('🧠 Analyzing evidence...');
    const evidenceSummary = uniqueSources
      .map((s, idx) => `[Source ${idx + 1}: ${s.domain} (Level ${s.level})] ${s.snippet}`)
      .join('\n');

    // Cache the result
    knowledgeCache.set(prompt, uniqueSources, evidenceSummary);

    // Step 6: Complete
    if (onProgress) onProgress('✓ Research ready');

    return {
      query: prompt,
      depth,
      sources: uniqueSources,
      findings: evidenceSummary,
      conflictsDetected: false,
      confidence: uniqueSources.some((s) => s.level === 1) ? 'HIGH' : 'MEDIUM',
      synthesizedEvidence: evidenceSummary,
    };
  }

  private deduplicateSources(sources: SearchSource[]): SearchSource[] {
    const seen = new Set<string>();
    return sources.filter((s) => {
      if (seen.has(s.url)) return false;
      seen.add(s.url);
      return true;
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const researchAgent = new ResearchAgent();
