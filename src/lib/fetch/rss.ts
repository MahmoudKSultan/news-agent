"use server"

import Parser from "rss-parser"
import { queryAll, execute, generateId, now } from "@/lib/db"
import { scrapeWebPage } from "./scrape"
import type { Source } from "@/types/article"

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
})

export interface ParsedArticle {
  title: string
  url: string
  author: string | null
  content: string
  publishedAt: string | null
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) : str
}

export async function fetchRssFeed(source: Source): Promise<ParsedArticle[]> {
  try {
    const feed = await parser.parseURL(source.url)
    if (!feed.items?.length) return []

    return feed.items
      .map(
        (item): ParsedArticle => ({
          title: truncate(item.title?.trim() || "Untitled", 500),
          url: item.link?.trim() || "",
          author: item.creator || item.author || null,
          content: truncate(
            item.contentSnippet?.trim() || item.content?.trim() || "",
            50000
          ),
          publishedAt: item.isoDate || item.pubDate || null,
        })
      )
      .filter((a) => a.url && a.content)
  } catch {
    return []
  }
}

async function fetchWebSource(source: Source): Promise<ParsedArticle[]> {
  const article = await scrapeWebPage(source.url)
  if (!article) return []

  return [
    {
      title: article.title,
      url: article.url,
      author: null,
      content: article.content,
      publishedAt: article.publishedAt,
    },
  ]
}

export async function saveArticles(
  sourceId: string,
  sessionId: string,
  articles: ParsedArticle[]
): Promise<number> {
  let saved = 0
  const insertedAt = now()

  for (const article of articles) {
    try {
      execute(
        `INSERT OR IGNORE INTO articles (id, source_id, session_id, title, url, author, raw_text, published_at, fetched_at)
         VALUES ($id, $sourceId, $sessionId, $title, $url, $author, $rawText, $publishedAt, $fetchedAt)`,
        {
          id: generateId(),
          sourceId,
          sessionId,
          title: article.title,
          url: article.url,
          author: article.author,
          rawText: article.content,
          publishedAt: article.publishedAt,
          fetchedAt: insertedAt,
        }
      )
      saved++
    } catch {
      // skip duplicate URLs
    }
  }

  return saved
}

export async function fetchAllSources(
  sessionId: string
): Promise<{ source: string; count: number }[]> {
  const sources = queryAll<Source>(
    "SELECT * FROM sources WHERE is_active = 1 ORDER BY created_at ASC"
  )

  const results: { source: string; count: number }[] = []

  for (const source of sources) {
    let articles: ParsedArticle[] = []

    if (source.type === "rss") {
      articles = await fetchRssFeed(source)
      // fallback: if RSS fails, try scraping the page directly
      if (articles.length === 0) {
        articles = await fetchWebSource(source)
      }
    } else {
      articles = await fetchWebSource(source)
    }

    if (articles.length === 0) continue

    const saved = await saveArticles(source.id, sessionId, articles)
    results.push({ source: source.name, count: saved })
  }

  return results
}
