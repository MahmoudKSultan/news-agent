"use client"

import { Icon } from "@iconify/react"
import { Button } from "@/components/ui/button"

export function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <header className="flex items-center h-14 px-4 border-b bg-background lg:px-6">
      <Button variant="ghost" size="icon" onClick={onMenuToggle} className="lg:hidden">
        <Icon icon="mdi:menu" className="size-5" />
      </Button>
      <div className="flex-1" />
    </header>
  )
}
