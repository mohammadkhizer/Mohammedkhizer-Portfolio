import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://mohammedkhizershaikh.netlify.app';

  return {
    rules: [
      // ── Standard web crawlers ──────────────────────────────────────────────
      {
        userAgent: '*',
        allow: '/',
        // Block admin, API routes, and monitoring from all bots
        disallow: ['/api/', '/admin/', '/monitoring/'],
      },

      // ── AI Search crawlers — explicitly allowed for GEO/AIO benefits ──────
      // GPTBot: OpenAI's web crawler used for ChatGPT Browse and training
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/monitoring/'],
      },
      // Claude-Web: Anthropic's crawler for Claude AI web search
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/api/', '/admin/', '/monitoring/'],
      },
      // PerplexityBot: Perplexity AI's search crawler
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/monitoring/'],
      },
      // Applebot-Extended: Apple Intelligence and Siri web search
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: ['/api/', '/admin/', '/monitoring/'],
      },
      // Googlebot-Extended: Used for Google AI Overviews and Gemini
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/admin/', '/monitoring/'],
      },
      // Meta-ExternalAgent: Meta AI assistant crawler
      {
        userAgent: 'Meta-ExternalAgent',
        allow: '/',
        disallow: ['/api/', '/admin/', '/monitoring/'],
      },
      // Amazonbot: Amazon Alexa and AI services
      {
        userAgent: 'Amazonbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/monitoring/'],
      },
      // BingBot and Copilot: Microsoft Copilot uses Bing's index
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/monitoring/'],
      },
      // DuckDuckBot: DuckDuckGo AI answers
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/monitoring/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    // Host directive helps crawlers identify canonical domain
    host: baseUrl,
  };
}
