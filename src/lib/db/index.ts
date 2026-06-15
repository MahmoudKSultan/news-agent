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

// Helper: run a query that returns rows
export function queryAll<T>(sql: string, params?: Record<string, unknown>): T[] {
  const stmt = getDb().prepare(sql)
  return (stmt.all(params) ?? []) as T[]
}

// Helper: run a query that returns one row
export function queryOne<T>(sql: string, params?: Record<string, unknown>): T | null {
  const stmt = getDb().prepare(sql)
  return (stmt.get(params) ?? null) as T | null
}

// Helper: run a write statement
export function execute(sql: string, params?: Record<string, unknown>): { changes: number; lastInsertRowid: number | bigint } {
  const stmt = getDb().prepare(sql)
  const result = stmt.run(params)
  return { changes: result.changes, lastInsertRowid: result.lastInsertRowid }
}
