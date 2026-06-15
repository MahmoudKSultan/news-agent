"use server"

export interface DiscoveredSource {
  title: string
  url: string
  type: "rss" | "youtube"
  description: string
}

const RSS_INDICATORS = ["/feed", "/rss", "/xml", "feed.xml", "rss.xml", "atom.xml"]

function looksLikeRssUrl(url: string): boolean {
  return RSS_INDICATORS.some((i) => url.toLowerCase().includes(i))
}

function looksLikeYoutubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be")
}

function extractFeedUrls(html: string, topic: string): DiscoveredSource[] {
  const results: DiscoveredSource[] = []
  const seen = new Set<string>()

  // Match DuckDuckGo result links
  const linkRegex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi
  let match

  while ((match = linkRegex.exec(html)) !== null) {
    let url = match[1].trim()
    const titleRaw = match[2].replace(/<[^>]*>/g, "").trim()

    // DuckDuckGo wraps URLs
    if (url.startsWith("//")) url = `https:${url}`
    if (url.includes("uddg=")) {
      const u = new URL(url)
      const redirect = u.searchParams.get("uddg")
      if (redirect) url = redirect
    }

    if (!url.startsWith("http") || seen.has(url)) continue
    seen.add(url)

    if (looksLikeYoutubeUrl(url)) {
      results.push({ title: titleRaw || url, url, type: "youtube", description: "YouTube" })
    } else if (looksLikeRssUrl(url)) {
      results.push({ title: titleRaw || url, url, type: "rss", description: "RSS Feed" })
    } else {
      // General site — suggest as possible RSS source
      results.push({ title: titleRaw || url, url, type: "rss", description: "Website (check for RSS)" })
    }
  }

  return results.slice(0, 12)
}

async function searchDdg(query: string): Promise<string> {
  const body = new URLSearchParams({ q: query })
  const res = await fetch("https://html.duckduckgo.com/html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })
  return res.text()
}

export async function discoverSources(topic: string): Promise<DiscoveredSource[]> {
  const queries = [
    `${topic} RSS feed`,
    `${topic} news feed`,
    `${topic} site:youtube.com`,
  ]

  const all: DiscoveredSource[] = []
  const seenUrls = new Set<string>()

  for (const q of queries) {
    try {
      const html = await searchDdg(q)
      const results = extractFeedUrls(html, topic)
      for (const r of results) {
        if (!seenUrls.has(r.url)) {
          seenUrls.add(r.url)
          all.push(r)
        }
      }
    } catch {
      // skip failed queries
    }
  }

  return all.slice(0, 12)
}
