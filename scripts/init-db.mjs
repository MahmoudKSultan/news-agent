import { DatabaseSync } from "node:sqlite"
import path from "node:path"
import fs from "node:fs"
import { fileURLToPath } from "node:url"

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const dbPath = path.join(dir, "data", "news-agent.db")

fs.mkdirSync(path.dirname(dbPath), { recursive: true })
const db = new DatabaseSync(dbPath)
db.exec("PRAGMA journal_mode = WAL")
db.exec("PRAGMA foreign_keys = ON")
db.exec(`
  CREATE TABLE IF NOT EXISTS sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK(type IN ('rss', 'youtube', 'web')),
    is_active INTEGER NOT NULL DEFAULT 1,
    weight REAL NOT NULL DEFAULT 1.0,
    avg_rating REAL DEFAULT NULL,
    times_rated INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'running', 'completed', 'failed')),
    article_count INTEGER NOT NULL DEFAULT 0,
    avg_rating REAL DEFAULT NULL,
    started_at TEXT DEFAULT NULL,
    completed_at TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    author TEXT DEFAULT NULL,
    raw_text TEXT NOT NULL,
    summary_short TEXT DEFAULT NULL,
    summary_detailed TEXT DEFAULT NULL,
    analysis_json TEXT DEFAULT NULL,
    category TEXT DEFAULT NULL,
    source_lang TEXT DEFAULT NULL,
    translated_text TEXT DEFAULT NULL,
    target_lang TEXT DEFAULT NULL,
    published_at TEXT DEFAULT NULL,
    fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS article_interactions (
    id TEXT PRIMARY KEY,
    article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    rating INTEGER DEFAULT NULL CHECK(rating >= 1 AND rating <= 5),
    read_time_sec INTEGER DEFAULT NULL,
    clicked_details INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS agent_logs (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    article_id TEXT REFERENCES articles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    params_json TEXT DEFAULT NULL,
    rating_before INTEGER DEFAULT NULL,
    rating_after INTEGER DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_articles_source_id ON articles(source_id);
  CREATE INDEX IF NOT EXISTS idx_articles_session_id ON articles(session_id);
  CREATE INDEX IF NOT EXISTS idx_articles_url ON articles(url);
  CREATE INDEX IF NOT EXISTS idx_articles_fetched_at ON articles(fetched_at);
  CREATE INDEX IF NOT EXISTS idx_interactions_article_id ON article_interactions(article_id);
  CREATE INDEX IF NOT EXISTS idx_interactions_session_id ON article_interactions(session_id);
`)
db.close()
console.log("Database initialized at:", dbPath)
