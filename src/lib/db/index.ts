import { DatabaseSync } from "node:sqlite"
import { SCHEMA_SQL } from "./schema"
import path from "node:path"
import fs from "node:fs"

const DB_PATH = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.replace("file:", "")
  : path.join(process.cwd(), "data", "news-agent.db")

let db: DatabaseSync | null = null

export function getDb(): DatabaseSync {
  if (!db) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
    db = new DatabaseSync(DB_PATH)
    db.exec("PRAGMA journal_mode = WAL")
    db.exec("PRAGMA foreign_keys = ON")
    db.exec(SCHEMA_SQL)
  }
  return db
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function now(): string {
  return new Date().toISOString()
}

function withPrefix(params?: Record<string, unknown>): Record<string, unknown> {
  if (!params) return {}
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(params)) {
    out[`$${k}`] = v
  }
  return out
}

export function queryAll<T>(sql: string, params?: Record<string, unknown>): T[] {
  const stmt = getDb().prepare(sql)
  const result = stmt.all(withPrefix(params))
  return (result ?? []) as T[]
}

export function queryOne<T>(sql: string, params?: Record<string, unknown>): T | null {
  const stmt = getDb().prepare(sql)
  const result = stmt.get(withPrefix(params))
  return (result ?? null) as T | null
}

export function execute(sql: string, params?: Record<string, unknown>): { changes: number; lastInsertRowid: number | bigint } {
  const stmt = getDb().prepare(sql)
  const result = stmt.run(withPrefix(params))
  return { changes: result.changes, lastInsertRowid: result.lastInsertRowid }
}
