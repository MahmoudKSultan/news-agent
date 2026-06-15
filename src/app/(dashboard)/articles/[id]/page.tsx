import { notFound } from "next/navigation"

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Article</h1>
        <p className="text-muted-foreground mt-1">ID: {id}</p>
      </div>
    </div>
  )
}
