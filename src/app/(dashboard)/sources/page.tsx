export default function SourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sources</h1>
        <p className="text-muted-foreground mt-1">Manage RSS feeds and YouTube channels.</p>
      </div>
      <div className="rounded-xl border bg-card p-6 sm:p-8 text-center text-muted-foreground">
        <p>No sources yet. Add your first one.</p>
      </div>
    </div>
  )
}
