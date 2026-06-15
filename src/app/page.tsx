import Link from "next/link"
import { Icon } from "@iconify/react"

const features = [
  { icon: "mdi:rss", title: "RSS & YouTube", description: "Fetch from any RSS feed or YouTube channel" },
  { icon: "mdi:robot", title: "AI Analysis", description: "Summarize, sentiment, entities — all local" },
  { icon: "mdi:translate", title: "Translation", description: "Translate articles to any language" },
  { icon: "mdi:star", title: "Learn & Adapt", description: "Rate articles and the agent learns your preferences" },
]

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between h-14 px-4 sm:px-6 border-b">
        <div className="flex items-center gap-2">
          <Icon icon="mdi:robot" className="size-6 text-primary" />
          <span className="font-semibold">News Agent</span>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center h-8 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/80 transition-colors"
        >
          Dashboard
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center max-w-lg">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            News Intelligence Agent
          </h1>
          <p className="mt-4 text-muted-foreground">
            Gather, summarize, analyze, and translate news from across the web.
            Powered by local AI that learns what you care about.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/80 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 max-w-2xl">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-4">
              <Icon icon={f.icon} className="size-6 text-primary" />
              <h3 className="mt-2 font-semibold text-sm">{f.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
