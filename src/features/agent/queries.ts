import { queryOne } from "@/lib/db"
import type { Session } from "@/types/article"

export function getLatestSession(): Session | null {
  return queryOne<Session>(
    "SELECT * FROM sessions ORDER BY created_at DESC LIMIT 1"
  )
}

export function getArticleCount(): number {
  const row = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM articles")
  return row?.count ?? 0
}

export function getSourceCount(): number {
  const row = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM sources")
  return row?.count ?? 0
}
