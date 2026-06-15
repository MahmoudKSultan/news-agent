export const siteConfig = {
  name: "News Intelligence Agent",
  description: "AI-powered news aggregator with analysis, translation, and learning",
  url: "https://news-agent.vercel.app",
  author: "news-agent",
  links: {
    github: "https://github.com/yourusername/news-agent",
  },
} as const

export type SiteConfig = typeof siteConfig
