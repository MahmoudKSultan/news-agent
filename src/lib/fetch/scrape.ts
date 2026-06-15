"use server"

import * as cheerio from "cheerio"

interface ScrapedArticle {
  title: string
  url: string
  content: string
  publishedAt: string | null
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim()
}

function extractContent($: cheerio.CheerioAPI): string {
  const selectors = [
    "article",
    "[role=main]",
    "main",
    ".content",
    ".post-content",
    ".article-body",
    ".documentation",
    ".markdown",
    "#content",
    ".prose",
  ]

  for (const sel of selectors) {
    const el = $(sel)
    if (el.length) {
      const text = el.text()
      if (text.length > 200) return cleanText(text)
    }
  }

  // Fallback: get all paragraph text from body
  const paragraphs: string[] = []
  $("p").each((_, el) => {
    const t = $(el).text().trim()
    if (t.length > 20) paragraphs.push(t)
  })

  return paragraphs.join("\n\n").slice(0, 50000)
}

export async function scrapeWebPage(url: string): Promise<ScrapedArticle | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      },
    })

    if (!res.ok) return null

    const html = await res.text()
    const $ = cheerio.load(html)

    const title =
      $("title").text().trim() ||
      $("h1").first().text().trim() ||
      "Untitled"

    const content = extractContent($)
    if (!content || content.length < 50) return null

    return {
      title,
      url,
      content,
      publishedAt: null,
    }
  } catch {
    return null
  }
}

export async function scrapeAllWebPages(urls: string[]): Promise<ScrapedArticle[]> {
  const results: ScrapedArticle[] = []

  for (const url of urls) {
    const article = await scrapeWebPage(url)
    if (article) results.push(article)
    // small delay to be polite
    await new Promise((r) => setTimeout(r, 500))
  }

  return results
}
