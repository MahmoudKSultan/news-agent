"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { Button } from "@/components/ui/button"
import { runAgent } from "@/features/agent/actions"

export function RunAgentButton() {
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handleRun() {
    setRunning(true)
    setResult(null)
    const res = await runAgent()
    if (res.success) {
      setResult(`Fetched ${res.totalArticles} articles from ${res.sources?.length ?? 0} sources`)
    } else {
      setResult(`Error: ${res.error}`)
    }
    setRunning(false)
  }

  return (
    <div className="flex items-center gap-3">
      {result && (
        <span className={`text-xs ${result.startsWith("Error") ? "text-destructive" : "text-sentiment-positive"}`}>
          {result}
        </span>
      )}
      <Button onClick={handleRun} disabled={running} className="gap-2">
        <Icon icon={running ? "mdi:loading" : "mdi:play"} className={`size-4 ${running ? "animate-spin" : ""}`} />
        {running ? "Running..." : "Run Agent"}
      </Button>
    </div>
  )
}
