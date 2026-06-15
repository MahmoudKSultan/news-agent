import { queryAll } from "@/lib/db"
import type { ArticleWithSource } from "@/types/article"

const ARTICLE_SELECT = `SELECT a.*, s.name as source_name
FROM articles a
LEFT JOIN sources s ON s.id = a.source_id`

export function getArticles(): ArticleWithSource[] {
  const rows = queryAll<Record<string, unknown>>(
    `${ARTICLE_SELECT} ORDER BY a.fetched_at DESC LIMIT 50`
  )
  return JSON.parse(JSON.stringify(rows)) as ArticleWithSource[]
}

export function getArticle(id: string): ArticleWithSource | null {
  const row = queryAll<Record<string, unknown>>(
    `${ARTICLE_SELECT} WHERE a.id = $id`,
    { id }
  )
  const articles = JSON.parse(JSON.stringify(row)) as ArticleWithSource[]
  return articles[0] ?? null
}
