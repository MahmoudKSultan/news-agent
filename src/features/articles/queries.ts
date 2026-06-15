import { queryAll } from "@/lib/db"
import type { Article } from "@/types/article"

export function getArticles(): Article[] {
  const rows = queryAll<Record<string, unknown>>(
    `SELECT a.*, s.name as source_name
     FROM articles a
     LEFT JOIN sources s ON s.id = a.source_id
     ORDER BY a.fetched_at DESC
     LIMIT 50`
  )
  return JSON.parse(JSON.stringify(rows)) as Article[]
}

export function getArticle(id: string): Article | null {
  const row = queryAll<Record<string, unknown>>(
    `SELECT a.*, s.name as source_name
     FROM articles a
     LEFT JOIN sources s ON s.id = a.source_id
     WHERE a.id = $id`,
    { id }
  )
  const articles = JSON.parse(JSON.stringify(row)) as Article[]
  return articles[0] ?? null
}
