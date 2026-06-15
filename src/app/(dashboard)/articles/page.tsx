import { getArticles } from "@/features/articles/queries"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@iconify/react"

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Articles</h1>
        <p className="text-muted-foreground mt-1 text-sm">{articles.length} articles fetched</p>
      </div>

      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Icon icon="mdi:newspaper-variant-outline" className="size-12 mb-4 opacity-30" />
          <p className="font-medium">No articles yet</p>
          <p className="text-sm mt-1">Run the agent to fetch articles from your sources.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="block rounded-xl border bg-card p-4 sm:p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                    {article.source_name && (
                      <Badge variant="outline" className="text-xs font-normal gap-1">
                        <Icon icon="mdi:rss" className="size-3" />
                        {article.source_name}
                      </Badge>
                    )}
                    {article.author && (
                      <span className="flex items-center gap-1">
                        <Icon icon="mdi:account" className="size-3" />
                        {article.author}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Icon icon="mdi:calendar" className="size-3" />
                      {formatDate(article.published_at || article.fetched_at)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {article.raw_text?.slice(0, 250) ?? ""}...
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
