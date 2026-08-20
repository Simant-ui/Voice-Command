export interface SearchSource {
  title: string;
  url: string;
  snippet: string;
  level: 1 | 2 | 3; // Level 1 = Official/Primary, Level 2 = Reputable News, Level 3 = Community
  domain: string;
  date?: string;
}

export interface SearchResult {
  query: string;
  sources: SearchSource[];
}

export interface SearchProvider {
  name: string;
  search(query: string, maxResults?: number): Promise<SearchResult>;
}

// 1. Web Search Provider (DuckDuckGo / Google Web Search Scraper API)
export class WebSearchProvider implements SearchProvider {
  name = 'WebSearchProvider';

  async search(query: string, maxResults: number = 5): Promise<SearchResult> {
    try {
      const endpoint = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(endpoint)}`);
      
      if (!res.ok) throw new Error('Search request failed');
      const data = await res.json();
      const htmlText = data.contents || '';

      const sources: SearchSource[] = [];
      const linkRegex = /<a class="result__url" href="([^"]+)".*?>\s*(.*?)\s*<\/a>[\s\S]*?<a class="result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
      
      let match;
      while ((match = linkRegex.exec(htmlText)) !== null && sources.length < maxResults) {
        let rawUrl = match[1];
        if (rawUrl.startsWith('//duckduckgo.com/l/?uddg=')) {
          const urlParam = new URLSearchParams(rawUrl.split('?')[1]).get('uddg');
          if (urlParam) rawUrl = decodeURIComponent(urlParam);
        }

        const domain = this.extractDomain(rawUrl);
        const level = this.determineSourceLevel(domain);

        sources.push({
          title: match[2].replace(/<[^>]+>/g, '').trim() || domain,
          url: rawUrl,
          snippet: match[3].replace(/<[^>]+>/g, '').trim(),
          level,
          domain,
        });
      }

      // Fallback structured results if HTML scraping produces 0 results
      if (sources.length === 0) {
        sources.push({
          title: `Search results for "${query}"`,
          url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          snippet: `Latest online information and technical references regarding ${query}.`,
          level: 2,
          domain: 'google.com',
        });
      }

      return { query, sources };
    } catch (err) {
      console.warn('[WebSearchProvider] Search fallback activated:', err);
      return {
        query,
        sources: [
          {
            title: `Google Web Search: ${query}`,
            url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            snippet: `Web research for "${query}".`,
            level: 2,
            domain: 'google.com',
          },
        ],
      };
    }
  }

  private extractDomain(url: string): string {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return parsed.hostname.replace(/^www\./, '');
    } catch {
      return 'web-source.com';
    }
  }

  private determineSourceLevel(domain: string): 1 | 2 | 3 {
    const d = domain.toLowerCase();
    // Level 1: Official Documentation, Academic, Government
    if (
      d.endsWith('.gov') ||
      d.endsWith('.edu') ||
      d.includes('react.dev') ||
      d.includes('developer.mozilla.org') ||
      d.includes('docs.python.org') ||
      d.includes('github.com') ||
      d.includes('wikipedia.org')
    ) {
      return 1;
    }
    // Level 2: Reputable News & Publications
    if (
      d.includes('bbc.') ||
      d.includes('reuters.') ||
      d.includes('cnn.') ||
      d.includes('techcrunch.') ||
      d.includes('theverge.') ||
      d.includes('onlinekhabar.') ||
      d.includes('ekantipur.') ||
      d.includes('bloomberg.')
    ) {
      return 2;
    }
    // Level 3: Community & Forums
    return 3;
  }
}

// 2. News Search Provider
export class NewsSearchProvider implements SearchProvider {
  name = 'NewsSearchProvider';

  async search(query: string, maxResults: number = 4): Promise<SearchResult> {
    const webSearch = new WebSearchProvider();
    return await webSearch.search(`${query} news latest update`, maxResults);
  }
}

// 3. Official Source Provider
export class OfficialSourceProvider implements SearchProvider {
  name = 'OfficialSourceProvider';

  async search(query: string, maxResults: number = 4): Promise<SearchResult> {
    const webSearch = new WebSearchProvider();
    return await webSearch.search(`${query} official documentation release notes`, maxResults);
  }
}
