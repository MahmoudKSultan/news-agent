"use client"

export function SourceFavicon({ url, className }: { url: string; className?: string }) {
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${getDomain(url)}&sz=16`}
      alt=""
      className={className}
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
    />
  )
}

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace("www.", "") } catch { return url }
}
