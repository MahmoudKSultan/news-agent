"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "mdi:view-dashboard" },
  { href: "/sources", label: "Sources", icon: "mdi:rss" },
  { href: "/articles", label: "Articles", icon: "mdi:newspaper" },
  { href: "/settings", label: "Settings", icon: "mdi:cog" },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-2 h-14 px-4 border-b border-sidebar-border">
          <Icon icon="mdi:robot" className="size-6 text-primary" />
          <span className="font-semibold text-sidebar-foreground">News Agent</span>
        </div>
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon icon={item.icon} className="size-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
