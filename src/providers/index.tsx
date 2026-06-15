"use client"

import { type ReactNode } from "react"
import { QueryProvider } from "./query-provider"
import { TopLoader } from "@/components/ui/top-loader"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <TopLoader />
      {children}
    </QueryProvider>
  )
}
