"use client"

import { Icon } from "@iconify/react"
import { deleteSource, toggleSource } from "../actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Source } from "@/types/article"

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "")
  } catch {
    return url
  }
}

function faviconUrl(url: string): string {
  return `https://www.google.com/s2/favicons?domain=${getDomain(url)}&sz=32`
}

const typeConfig = {
  rss: { icon: "mdi:rss", label: "RSS", class: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  youtube: { icon: "mdi:youtube", label: "YouTube", class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  web: { icon: "mdi:web", label: "Web", class: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
}

function SourceIcon({ source }: { source: Source }) {
  if (source.type === "youtube") {
    return (
      <div className="size-10 rounded-lg flex items-center justify-center bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
        <Icon icon="mdi:youtube" className="size-5" />
      </div>
    )
  }

  const domain = getDomain(source.url)

  return (
    <div className="size-10 rounded-lg flex items-center justify-center overflow-hidden bg-muted shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={faviconUrl(source.url)}
        alt={`${domain} icon`}
        className="size-5"
        onError={(e) => {
          const el = e.currentTarget
          el.style.display = "none"
          el.insertAdjacentHTML(
            "afterend",
            `<span class="text-xs font-medium text-muted-foreground opacity-60">${domain.charAt(0).toUpperCase()}</span>`
          )
        }}
      />
    </div>
  )
}

export function SourceList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Icon icon="mdi:rss-box" className="size-12 mb-4 opacity-30" />
        <p className="font-medium">No sources yet</p>
        <p className="text-sm mt-1">Add your first RSS feed or YouTube channel above.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sources.map((source) => {
        const cfg = typeConfig[source.type]
        return (
          <div
            key={source.id}
            className="rounded-xl border bg-card p-4 flex items-center gap-4 transition-shadow hover:shadow-sm"
          >
            <SourceIcon source={source} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{source.name}</span>
                <Badge variant="outline" className="text-xs font-normal">{cfg.label}</Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{getDomain(source.url)}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => toggleSource(source.id, !source.is_active)}
                title={source.is_active ? "Disable" : "Enable"}
              >
                <Icon
                  icon={source.is_active ? "mdi:eye" : "mdi:eye-off"}
                  className={`size-4 ${source.is_active ? "text-muted-foreground" : "text-muted-foreground/40"}`}
                />
              </Button>
              <form action={async () => { await deleteSource(source.id) }}>
                <Button variant="ghost" size="icon-sm" type="submit">
                  <Icon icon="mdi:delete" className="size-4 text-destructive" />
                </Button>
              </form>
            </div>
          </div>
        )
      })}
    </div>
  )
}
