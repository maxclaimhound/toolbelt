/**
 * AgentSkill: Web Scraper Lite
 * Fetches a URL and extracts main content, title, links, and metadata.
 * No API key required. Uses fetch + lightweight HTML parsing.
 */

export async function execute(input) {
  const { url, extractLinks = false, maxContentLength = 3000 } = input;
  if (!url) throw new Error('url is required');

  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AgentSkills/1.0)' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

  const html = await response.text();

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Extract meta description
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  const description = descMatch ? descMatch[1].trim() : '';

  // Strip scripts, styles, nav, footer, header tags
  let content = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (content.length > maxContentLength) {
    content = content.substring(0, maxContentLength) + '...';
  }

  // Extract links if requested
  let links = [];
  if (extractLinks) {
    const linkMatches = html.matchAll(/<a[^>]+href=["']([^"'#]+)["'][^>]*>([^<]*)<\/a>/gi);
    for (const m of linkMatches) {
      try {
        const href = new URL(m[1], url).href;
        if (links.length < 20) links.push({ href, text: m[2].trim() });
      } catch {}
    }
  }

  return { url, title, description, content, links, contentLength: content.length };
}

export const toolDefinition = {
  type: 'function',
  function: {
    name: 'web_scraper_lite',
    description: 'Fetch a URL and extract its title, description, and main text content.',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'URL to scrape' },
        extractLinks: { type: 'boolean', description: 'Also extract links from the page' },
        maxContentLength: { type: 'number', description: 'Max content characters to return (default 3000)' },
      },
      required: ['url'],
    },
  },
};
