import { getSources } from "@/features/sources/queries"
import { AddSourceForm } from "@/features/sources/components/add-source-form"
import { SourceList } from "@/features/sources/components/source-list"

export default function SourcesPage() {
  const sources = getSources()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sources</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage RSS feeds and YouTube channels.
          </p>
        </div>
        <AddSourceForm />
      </div>
      <SourceList sources={sources} />
    </div>
  )
}
