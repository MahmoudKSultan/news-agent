import { getArticles } from "@/features/articles/queries"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { SourceFavicon } from "@/components/shared/source-favicon"

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  return d.toLocaleDateString()
}

export default function ArticlesPage() {
  const articles = getArticles()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Articles</h1>
          <p className="text-muted-foreground mt-1 text-sm">{articles.length} articles fetched</p>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Icon icon="mdi:newspaper-variant-outline" className="size-8 opacity-40" />
          </div>
          <p className="font-medium">No articles yet</p>
          <p className="text-sm mt-1">Run the agent to fetch articles from your sources.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="group relative rounded-xl border bg-card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-6 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    <SourceFavicon url={article.url} className="size-4" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground truncate">
                    {article.source_name || "Unknown"}
                  </span>
                  <span className="text-xs text-muted-foreground/50">·</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(article.published_at || article.fetched_at)}
                  </span>
                </div>

                <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>

                <p className="text-xs text-muted-foreground/70 mt-2 line-clamp-2 leading-relaxed">
                  {article.raw_text?.slice(0, 200) ?? ""}...
                </p>

                <div className="flex items-center gap-3 mt-4 pt-3 border-t text-xs text-muted-foreground/50">
                  <span className="flex items-center gap-1">
                    <Icon icon="mdi:clock-outline" className="size-3" />
                    {formatDate(article.fetched_at)}
                  </span>
                  {article.author && (
                    <span className="flex items-center gap-1 truncate">
                      <Icon icon="mdi:account" className="size-3 shrink-0" />
                      <span className="truncate">{article.author}</span>
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
