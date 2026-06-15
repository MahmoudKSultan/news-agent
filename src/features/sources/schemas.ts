import { z } from "zod"

export const addSourceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  url: z.string().url("Must be a valid URL"),
  type: z.enum({ rss: "rss", youtube: "youtube" }),
})

export type AddSourceInput = z.infer<typeof addSourceSchema>
