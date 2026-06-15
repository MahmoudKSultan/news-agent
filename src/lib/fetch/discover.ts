"use server"

import * as cheerio from "cheerio"

export interface DiscoveredSource {
  title: string
  url: string
  type: "rss" | "youtube"
  description: string
}

function classifyUrl(url: string): "rss" | "youtube" {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
  return "rss"
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "")
  } catch {
    return url
  }
}

async function searchGoogle(query: string): Promise<{ title: string; url: string; snippet: string }[]> {
  const res = await fetch(
    `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=en`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    }
  )

  const html = await res.text()
  const $ = cheerio.load(html)
  const results: { title: string; url: string; snippet: string }[] = []

  $("a").each((_, el) => {
    const href = $(el).attr("href")
    const text = $(el).text().trim()
    if (!href || !text) return

    // Google wraps real URLs in /url?q=...
    let url = ""
    if (href.startsWith("/url?q=")) {
      url = decodeURIComponent(href.replace("/url?q=", "").split("&")[0])
    } else if (href.startsWith("http") && !href.includes("google.com")) {
      url = href
    }

    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      const parent = $(el).closest("div").parent()
      const snippet = parent.find("div, span").first().text().trim().slice(0, 200)
      results.push({ title: text, url, snippet })
    }
  })

  return results.slice(0, 10)
}

export async function discoverSources(topic: string): Promise<DiscoveredSource[]> {
  const queries = [
    `${topic} RSS feed`,
    `${topic} news feed`,
    `${topic} blog`,
    `${topic} site:youtube.com`,
  ]

  const seen = new Set<string>()
  const results: DiscoveredSource[] = []

  for (const q of queries) {
    try {
      const links = await searchGoogle(q)
      for (const link of links) {
        const domain = extractDomain(link.url)
        if (seen.has(domain)) continue
        seen.add(domain)

        results.push({
          title: link.title.slice(0, 100),
          url: link.url,
          type: classifyUrl(link.url),
          description: link.snippet.slice(0, 150),
        })
      }
    } catch {
      // skip failed queries
    }
  }

  return results.slice(0, 12)
}
