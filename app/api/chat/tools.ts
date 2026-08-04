import { tool } from 'ai';
import { z } from 'zod';

export const fetchMetaTags = tool({
  description: 'Fetch the title and description meta tags from a given website URL.',
  inputSchema: z.object({
    url: z.string().describe('The full URL of the website to check, including https://'),
  }),
  execute: async ({ url }) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch URL: ${res.status}`);
      }
      const html = await res.text();

      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);

      return {
        url,
        title: titleMatch ? titleMatch[1] : null,
        description: descMatch ? descMatch[1] : null,
      };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch meta tags');
    }
  },
});