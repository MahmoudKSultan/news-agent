import { getArticles } from "@/features/articles/queries"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@iconify/react"

export default function ArticlesPage() {
  const articles = getArticles()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Articles</h1>
        <p className="text-muted-foreground mt-1 text-sm">Browse fetched articles.</p>
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
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {(article as unknown as Record<string, string>).summary_short
                      ? (article as unknown as Record<string, string>).summary_short
                      : (article.raw_text?.slice(0, 200) ?? "") + "..."}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <span>{article.fetched_at ? new Date(article.fetched_at).toLocaleDateString() : ""}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
