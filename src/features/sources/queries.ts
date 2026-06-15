import { queryAll } from "@/lib/db"
import type { Source } from "@/types/article"

export function getSources(): Source[] {
  const rows = queryAll<Record<string, unknown>>("SELECT * FROM sources ORDER BY created_at DESC")
  return JSON.parse(JSON.stringify(rows)) as Source[]
}
