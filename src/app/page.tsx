export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-32 px-16">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">
          News Intelligence Agent
        </h1>
        <p className="mt-4 text-muted-foreground text-center max-w-md">
          AI-powered news aggregator with analysis, translation, and learning.
        </p>
      </main>
    </div>
  )
}
