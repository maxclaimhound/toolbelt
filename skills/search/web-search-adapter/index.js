/**
 * AgentSkill: Web Search Adapter
 * Formats queries and normalizes results across Brave, Serper, and SerpAPI.
 * Requires one of: BRAVE_API_KEY, SERPER_API_KEY, or SERPAPI_KEY
 */

export async function execute(input, env = {}) {
  const { query, provider = 'brave', count = 5 } = input;
  if (!query) throw new Error('query is required');

  if (provider === 'brave') {
    const key = env.BRAVE_API_KEY || process.env.BRAVE_API_KEY;
    if (!key) throw new Error('BRAVE_API_KEY required for brave provider');
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}`;
    const r = await fetch(url, { headers: { 'Accept': 'application/json', 'X-Subscription-Token': key } });
    const data = await r.json();
    return {
      results: (data.web?.results || []).map(i => ({ title: i.title, url: i.url, snippet: i.description })),
      provider: 'brave', query,
    };
  }

  if (provider === 'serper') {
    const key = env.SERPER_API_KEY || process.env.SERPER_API_KEY;
    if (!key) throw new Error('SERPER_API_KEY required for serper provider');
    const r = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: { 'X-API-KEY': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: query, num: count }),
    });
    const data = await r.json();
    return {
      results: (data.organic || []).map(i => ({ title: i.title, url: i.link, snippet: i.snippet })),
      provider: 'serper', query,
    };
  }

  throw new Error(`Unknown provider: ${provider}. Use 'brave' or 'serper'`);
}

export const toolDefinition = {
  type: 'function',
  function: {
    name: 'web_search',
    description: 'Search the web using Brave or Serper and return structured results.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        provider: { type: 'string', enum: ['brave', 'serper'], description: 'Search provider to use' },
        count: { type: 'number', description: 'Number of results (default 5)' },
      },
      required: ['query'],
    },
  },
};
