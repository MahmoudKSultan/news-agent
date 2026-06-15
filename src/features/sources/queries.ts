import { queryAll } from "@/lib/db"
import type { Source } from "@/types/article"

export function getSources(): Source[] {
  return queryAll<Source>("SELECT * FROM sources ORDER BY created_at DESC")
}
