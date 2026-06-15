export type SourceType = "rss" | "youtube" | "web"

export interface Source {
  id: string
  name: string
  url: string
  type: SourceType
  is_active: number
  weight: number
  avg_rating: number | null
  times_rated: number
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  source_id: string
  session_id: string | null
  title: string
  url: string
  author: string | null
  raw_text: string
  summary_short: string | null
  summary_detailed: string | null
  analysis_json: string | null
  category: string | null
  source_lang: string | null
  translated_text: string | null
  target_lang: string | null
  published_at: string | null
  fetched_at: string
}

export interface ArticleInteraction {
  id: string
  article_id: string
  session_id: string
  rating: number | null
  read_time_sec: number | null
  clicked_details: number
  created_at: string
}

export interface Session {
  id: string
  status: "pending" | "running" | "completed" | "failed"
  article_count: number
  avg_rating: number | null
  started_at: string | null
  completed_at: string | null
  created_at: string
}
