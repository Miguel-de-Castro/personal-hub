import { readFile, rename, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"
import type { Database, DataMode, StoredData } from "./types.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, "../data/db.json")
// db.json is gitignored (it holds your real data); a fresh clone seeds it from this file.
const SEED_PATH = path.join(__dirname, "../data/db.example.json")

let cache: StoredData | null = null
// Writes are serialized through this promise chain so concurrent requests
// (e.g. two quick edits) never interleave and corrupt the JSON file.
let writeQueue: Promise<void> = Promise.resolve()

// The sample data in db.example.json is written as of this day. When a fresh
// db.json is created, every date in the sample set is shifted by the days
// between this and today, so the demo always looks current (tasks due this
// week, recent log entries) instead of months overdue.
const DEMO_AS_OF = "2026-07-28"
const DAY_MS = 86_400_000

function utcDay(date: string): number {
  const [y, m, d] = date.split("-").map(Number)
  return Date.UTC(y, m - 1, d)
}

function shiftDemoDates(demo: Database, today: string): Database {
  const shiftDays = Math.round((utcDay(today) - utcDay(DEMO_AS_OF)) / DAY_MS)
  const shift = (date: string) => new Date(utcDay(date) + shiftDays * DAY_MS).toISOString().slice(0, 10)
  // Matches plain dates (2026-07-24) and the date part of timestamps (2026-07-20T09:00...).
  const json = JSON.stringify(demo).replace(/"(\d{4}-\d{2}-\d{2})(T[^"]*)?"/g, (_m, date: string, time = "") => `"${shift(date)}${time}"`)
  return JSON.parse(json) as Database
}

export function localToday(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

async function seedStore(): Promise<void> {
  const seed = JSON.parse(await readFile(SEED_PATH, "utf-8")) as StoredData
  seed.demo = shiftDemoDates(seed.demo, localToday())
  await writeFile(DB_PATH, JSON.stringify(seed, null, 2), "utf-8")
}

async function readStore(): Promise<StoredData> {
  if (cache) return cache
  if (!existsSync(DB_PATH)) await seedStore()
  const raw = await readFile(DB_PATH, "utf-8")
  cache = JSON.parse(raw) as StoredData
  return cache
}

async function writeStore(store: StoredData): Promise<void> {
  cache = store
  // Write to a temp file and rename it over db.json, so a crash mid-write can't
  // leave a truncated file. A failed write is reported to its caller but doesn't
  // poison the queue for the writes after it.
  const write = writeQueue.then(async () => {
    const tmp = `${DB_PATH}.tmp`
    await writeFile(tmp, JSON.stringify(store, null, 2), "utf-8")
    await rename(tmp, DB_PATH)
  })
  writeQueue = write.catch(() => {})
  return write
}

export async function getMode(): Promise<DataMode> {
  const store = await readStore()
  return store.mode
}

export async function setMode(mode: DataMode): Promise<void> {
  const store = await readStore()
  store.mode = mode
  await writeStore(store)
}

/** Reads the collection set for whichever mode (demo/live) is currently active. */
export async function readActiveDb(): Promise<Database> {
  const store = await readStore()
  return store[store.mode]
}

/** Persists a modified collection set back into the currently active mode's slot. */
export async function writeActiveDb(db: Database): Promise<void> {
  const store = await readStore()
  store[store.mode] = db
  await writeStore(store)
}
