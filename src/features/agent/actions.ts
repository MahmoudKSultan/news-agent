"use server"

import { revalidatePath } from "next/cache"
import { execute, generateId, now } from "@/lib/db"
import { fetchAllSources } from "@/lib/fetch/rss"

export async function runAgent() {
  const sessionId = generateId()
  const startedAt = now()

  execute(
    `INSERT INTO sessions (id, status, started_at, created_at) VALUES ($id, $status, $startedAt, $createdAt)`,
    { id: sessionId, status: "running", startedAt, createdAt: startedAt }
  )

  try {
    const results = await fetchAllSources(sessionId)
    const totalArticles = results.reduce((sum, r) => sum + r.count, 0)

    execute(
      `UPDATE sessions SET status = $status, article_count = $count, completed_at = $completedAt WHERE id = $id`,
      { id: sessionId, status: "completed", count: totalArticles, completedAt: now() }
    )

    revalidatePath("/dashboard")
    revalidatePath("/articles")

    return { success: true, sessionId, totalArticles, sources: results }
  } catch (error) {
    execute(
      `UPDATE sessions SET status = $status, completed_at = $completedAt WHERE id = $id`,
      { id: sessionId, status: "failed", completedAt: now() }
    )
    return { success: false, error: String(error) }
  }
}
