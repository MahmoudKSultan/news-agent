"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { addSource } from "../actions"
import { discoverSources, type DiscoveredSource } from "@/lib/fetch/discover"

export function DiscoverSources() {
  const [open, setOpen] = useState(false)
  const [topic, setTopic] = useState("")
  const [results, setResults] = useState<DiscoveredSource[]>([])
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState<Set<string>>(new Set())

  async function handleSearch() {
    if (!topic.trim()) return
    setLoading(true)
    setResults([])
    const found = await discoverSources(topic)
    setResults(found)
    setLoading(false)
  }

  async function handleAdd(source: DiscoveredSource) {
    setAdding((prev) => new Set(prev).add(source.url))
    await addSource({ name: source.title.slice(0, 100), url: source.url, type: source.type })
    setAdding((prev) => {
      const next = new Set(prev)
      next.delete(source.url)
      return next
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="gap-2" />}>
        <Icon icon="mdi:compass" className="size-4" />
        Discover
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Discover Sources</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">What topic are you interested in?</Label>
            <div className="flex gap-2">
              <Input
                id="topic"
                placeholder="e.g. artificial intelligence, climate change, space"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={loading || !topic.trim()}>
                {loading ? (
                  <Icon icon="mdi:loading" className="size-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Icon icon="mdi:loading" className="size-5 animate-spin mr-2" />
              Searching for sources...
            </div>
          )}

          {!loading && results.length === 0 && topic && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Icon icon="mdi:rss-off" className="size-8 mb-2 opacity-40" />
              <p className="text-sm">No sources found. Try a different topic.</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {results.map((source) => (
                <div
                  key={source.url}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div
                    className={`mt-0.5 size-8 shrink-0 rounded-md flex items-center justify-center ${
                      source.type === "youtube"
                        ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                    }`}
                  >
                    <Icon
                      icon={source.type === "youtube" ? "mdi:youtube" : "mdi:rss"}
                      className="size-4"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{source.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{source.url}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    disabled={adding.has(source.url)}
                    onClick={() => handleAdd(source)}
                  >
                    {adding.has(source.url) ? (
                      <Icon icon="mdi:check" className="size-4" />
                    ) : (
                      "Add"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              Found {results.length} sources. Click <strong>Add</strong> to add any to your list.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
