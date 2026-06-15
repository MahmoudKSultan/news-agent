"use server"

import { revalidatePath } from "next/cache"
import { execute, generateId, now } from "@/lib/db"
import { addSourceSchema, type AddSourceInput } from "./schemas"

export async function addSource(input: AddSourceInput) {
  const parsed = addSourceSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { name, url, type } = parsed.data

  try {
    execute(
      `INSERT INTO sources (id, name, url, type, created_at, updated_at)
       VALUES ($id, $name, $url, $type, $createdAt, $updatedAt)`,
      { id: generateId(), name, url, type, createdAt: now(), updatedAt: now() }
    )
    revalidatePath("/sources")
    return { success: true }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("UNIQUE")) {
      return { error: { url: ["This URL is already added"] } }
    }
    return { error: { _form: ["Failed to add source"] } }
  }
}

export async function deleteSource(id: string) {
  execute("DELETE FROM sources WHERE id = $id", { id })
  revalidatePath("/sources")
}

export async function toggleSource(id: string, isActive: boolean) {
  execute("UPDATE sources SET is_active = $isActive, updated_at = $updatedAt WHERE id = $id", {
    isActive: isActive ? 1 : 0,
    updatedAt: now(),
    id,
  })
  revalidatePath("/sources")
}
