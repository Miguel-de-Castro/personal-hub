import { randomUUID } from "node:crypto"
import { Router } from "express"
import { readActiveDb, writeActiveDb } from "../db.js"
export { localToday } from "../db.js"
import type { Database } from "../types.js"
import { parseBody, type Schema } from "../validate.js"

type Collection = keyof Database

/**
 * Builds a small REST router (list/create/update/delete) over one array
 * field of the JSON database. Every resource in this app shares the same
 * id-based CRUD shape, so this is the only place that logic lives.
 *
 * Request bodies go through `schema` (see validate.ts): only declared fields
 * are accepted, each type-checked; `id` and `createdAt` are server-owned.
 */
export function createResourceRouter<T extends { id: string; createdAt: string }>(
  collection: Collection,
  schema: Schema,
  buildNew: (fields: Partial<T>) => T,
) {
  const router = Router()

  router.get("/", async (_req, res) => {
    const db = await readActiveDb()
    res.json(db[collection])
  })

  router.post("/", async (req, res) => {
    const fields = parseBody(req.body, schema) as Partial<T>
    const db = await readActiveDb()
    const item = buildNew(fields)
    ;(db[collection] as unknown as T[]).push(item)
    await writeActiveDb(db)
    res.status(201).json(item)
  })

  router.patch("/:id", async (req, res) => {
    const fields = parseBody(req.body, schema)
    const db = await readActiveDb()
    const list = db[collection] as unknown as T[]
    const index = list.findIndex((entry) => entry.id === req.params.id)
    if (index === -1) {
      res.status(404).json({ error: "Not found" })
      return
    }
    const updated = { ...list[index], ...fields } as Record<string, unknown>
    // A field sent as null/"" clears it rather than storing an empty value.
    for (const [key, value] of Object.entries(fields)) if (value === undefined) delete updated[key]
    list[index] = updated as T
    await writeActiveDb(db)
    res.json(list[index])
  })

  router.delete("/:id", async (req, res) => {
    const db = await readActiveDb()
    const list = db[collection] as unknown as T[]
    const index = list.findIndex((entry) => entry.id === req.params.id)
    if (index === -1) {
      res.status(404).json({ error: "Not found" })
      return
    }
    list.splice(index, 1)
    await writeActiveDb(db)
    res.status(204).end()
  })

  return router
}

export function newId() {
  return randomUUID()
}

