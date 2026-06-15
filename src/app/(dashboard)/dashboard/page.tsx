import { Icon } from "@iconify/react"
import { getLatestSession, getArticleCount, getSourceCount } from "@/features/agent/queries"
import { RunAgentButton } from "./run-button"

export default function DashboardPage() {
  const session = getLatestSession()
  const articleCount = getArticleCount()
  const sourceCount = getSourceCount()

  const stats = [
    { label: "Sources", value: String(sourceCount), icon: "mdi:rss", color: "text-brand-500" },
    { label: "Articles", value: String(articleCount), icon: "mdi:newspaper", color: "text-chart-2" },
    { label: "Avg Rating", value: "—", icon: "mdi:star", color: "text-rating-star" },
    {
      label: "Last Run",
      value: session?.status === "completed" ? new Date(session.completed_at!).toLocaleDateString() : "Never",
      icon: "mdi:clock-outline",
      color: "text-muted-foreground",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Overview of your news agent activity.</p>
        </div>
        <RunAgentButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <Icon icon={stat.icon} className={`size-8 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {session && (
        <div className="rounded-xl border bg-card p-4 sm:p-5">
          <h2 className="text-sm font-semibold mb-2">Latest Run</h2>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Status: <span className={`font-medium ${session.status === "completed" ? "text-sentiment-positive" : session.status === "failed" ? "text-sentiment-negative" : ""}`}>{session.status}</span></p>
            <p>Articles: {session.article_count}</p>
            <p>Started: {session.started_at ? new Date(session.started_at).toLocaleString() : "—"}</p>
          </div>
        </div>
      )}

      {!session && (
        <div className="rounded-xl border bg-card p-6 sm:p-8">
          <h2 className="text-lg font-semibold">Getting Started</h2>
          <ol className="mt-4 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Add your first RSS feed in <strong>Sources</strong></li>
            <li>Click <strong>Run Agent</strong> to fetch articles</li>
            <li>Rate articles to train the agent</li>
          </ol>
        </div>
      )}
    </div>
  )
}
