import { Icon } from "@iconify/react"

const stats = [
  { label: "Sources", value: "0", icon: "mdi:rss", color: "text-brand-500" },
  { label: "Articles", value: "0", icon: "mdi:newspaper", color: "text-chart-2" },
  { label: "Avg Rating", value: "—", icon: "mdi:star", color: "text-rating-star" },
  { label: "Last Run", value: "Never", icon: "mdi:clock-outline", color: "text-muted-foreground" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your news agent activity.</p>
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

      <div className="rounded-xl border bg-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Getting Started</h2>
        <ol className="mt-4 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>Add your first RSS feed or YouTube channel in <strong>Sources</strong></li>
          <li>Run the agent to fetch articles</li>
          <li>Rate articles to train the agent</li>
        </ol>
      </div>
    </div>
  )
}
