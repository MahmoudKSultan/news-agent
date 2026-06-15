export default function ArticlesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Articles</h1>
        <p className="text-muted-foreground mt-1">Browse fetched articles.</p>
      </div>
      <div className="rounded-xl border bg-card p-6 sm:p-8 text-center text-muted-foreground">
        <p>No articles yet. Run the agent to fetch some.</p>
      </div>
    </div>
  )
}
