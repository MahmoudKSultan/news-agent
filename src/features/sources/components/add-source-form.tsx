"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Icon } from "@iconify/react"
import { addSourceSchema, type AddSourceInput } from "../schemas"
import { addSource } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

const sourceTypes = [
  { value: "rss", label: "RSS Feed", icon: "mdi:rss" },
  { value: "youtube", label: "YouTube", icon: "mdi:youtube" },
] as const

export function AddSourceForm() {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<AddSourceInput>({
    resolver: zodResolver(addSourceSchema),
    defaultValues: { type: "rss" },
  })

  async function onSubmit(data: AddSourceInput) {
    const result = await addSource(data)
    if (result?.error) {
      if (typeof result.error === "object") {
        const err = result.error as Record<string, string[] | undefined>
        if (err.url) setError("url", { message: err.url[0] })
        if (err.name) setError("name", { message: err.name[0] })
      }
      return
    }
    reset()
    setOpen(false)
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Icon icon="mdi:plus" className="size-4" />
        Add Source
      </Button>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">New Source</h3>
        <Button variant="ghost" size="icon-xs" onClick={() => setOpen(false)}>
          <Icon icon="mdi:close" className="size-4" />
        </Button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="e.g. BBC Tech" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            placeholder="https://feeds.bbci.co.uk/news/technology/rss.xml"
            {...register("url")}
          />
          {errors.url && (
            <p className="text-xs text-destructive">{errors.url.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <div className="flex gap-2">
            {sourceTypes.map((t) => (
              <label
                key={t.value}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium cursor-pointer has-checked:border-primary has-checked:bg-primary/5 has-checked:text-primary transition-colors"
              >
                <input
                  type="radio"
                  value={t.value}
                  {...register("type")}
                  className="sr-only"
                />
                <Icon icon={t.icon} className="size-4" />
                {t.label}
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Source"}
          </Button>
        </div>
      </form>
    </div>
  )
}
