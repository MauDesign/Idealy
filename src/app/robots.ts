import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const aiUserAgents = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-User',
    'Claude-SearchBot',
    'Google-Extended',
    'Google-CloudVertexBot',
    'PerplexityBot',
    'Perplexity-User',
    'FacebookBot',
    'Meta-ExternalAgent',
    'Meta-ExternalFetcher',
    'Applebot',
    'Applebot-Extended',
    'Amazonbot',
    'cohere-ai',
    'CCBot',
    'Bytespider',
    'TikTokSpider',
    'Diffbot',
    'Youbot',
  ]

  return {
    rules: [
      {
        userAgent: aiUserAgents,
        allow: '/',
        disallow: '/api/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
    ],
    sitemap: 'https://www.idealy.com.mx/sitemap.xml',
  }
}
