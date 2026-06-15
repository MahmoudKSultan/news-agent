"use client"

import { Suspense, useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import NProgress from "nprogress"

function TopLoaderInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const prevPath = useRef(pathname)

  useEffect(() => {
    NProgress.configure({ showSpinner: false, minimum: 0.15 })
  }, [])

  useEffect(() => {
    if (prevPath.current !== pathname) {
      NProgress.start()
      const timer = setTimeout(() => NProgress.done(), 300)
      prevPath.current = pathname
      return () => clearTimeout(timer)
    }
  }, [pathname, searchParams])

  return null
}

export function TopLoader() {
  return (
    <Suspense fallback={null}>
      <TopLoaderInner />
    </Suspense>
  )
}
