import { createResourceRouter, localToday, newId } from "./resource.js"
import type { LogEntry } from "../types.js"
import { date, optionalInteger, requiredText, stringList, text } from "../validate.js"

export const logRouter = createResourceRouter<LogEntry>(
  "logEntries",
  {
    date,
    title: requiredText(300),
    body: text(50_000),
    mood: optionalInteger(0, 10),
    tags: stringList(),
  },
  (body) => ({
    id: newId(),
    // Local date, not UTC: an entry written at 22:00 in Brazil belongs to today.
    date: body.date ?? localToday(),
    title: body.title ?? "Untitled entry",
    body: body.body ?? "",
    mood: body.mood,
    tags: body.tags ?? [],
    createdAt: new Date().toISOString(),
  }),
)
