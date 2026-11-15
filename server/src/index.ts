import express, { type NextFunction, type Request, type Response } from "express"
import cors from "cors"
import { tasksRouter } from "./routes/tasks.js"
import { learningRouter } from "./routes/learning.js"
import { jobsRouter } from "./routes/jobs.js"
import { logRouter } from "./routes/log.js"
import { settingsRouter } from "./routes/settings.js"
import { ValidationError } from "./validate.js"

const app = express()
app.disable("x-powered-by")
const PORT = Number(process.env.PORT ?? 4000)
// Loopback only: this API has no authentication and holds personal data.
const HOST = process.env.HOST ?? "127.0.0.1"

const LOOPBACK = new Set(["localhost", "127.0.0.1", "[::1]", "::1"])
const isLoopbackOrigin = (origin: string) => {
  try {
    return LOOPBACK.has(new URL(origin).hostname)
  } catch {
    return false
  }
}

// Refuse requests from other websites (Origin) and DNS-rebinding tricks (Host),
// so a page open in the browser can't read or change your data on localhost.
app.use((req, res, next) => {
  const host = (req.headers.host ?? "").replace(/:\d+$/, "")
  const origin = req.headers.origin
  if (!LOOPBACK.has(host) || (origin && !isLoopbackOrigin(origin))) {
    res.status(403).json({ error: "Personal Hub only accepts requests from this computer." })
    return
  }
  next()
})
app.use(cors({ origin: (origin, cb) => cb(null, !origin || isLoopbackOrigin(origin)) }))
// Writes must be JSON: a body sent as text/plain or form data is refused, not
// silently turned into an empty record.
app.use((req, res, next) => {
  if ((req.method === "POST" || req.method === "PATCH") && !req.is("application/json")) {
    res.status(415).json({ error: "Content-Type must be application/json" })
    return
  }
  next()
})
// Large enough for the longest log entry the schema allows (50k characters).
app.use(express.json({ limit: "256kb" }))

app.use("/api/tasks", tasksRouter)
app.use("/api/learning", learningRouter)
app.use("/api/jobs", jobsRouter)
app.use("/api/log", logRouter)
app.use("/api/settings", settingsRouter)

app.get("/api/health", (_req, res) => {
  res.json({ ok: true })
})

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" })
})

// Errors come back as JSON, never as an HTML stack trace with local file paths.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message })
    return
  }
  const status = (err as { status?: number }).status
  if (status === 413) {
    res.status(413).json({ error: "Request body is too large" })
    return
  }
  if (typeof status === "number" && status >= 400 && status < 500) {
    // e.g. malformed JSON (400) or an oversized body (413) from express.json()
    res.status(status).json({ error: "Invalid request body" })
    return
  }
  console.error(err)
  res.status(500).json({ error: "Internal server error" })
})

app.listen(PORT, HOST, () => {
  console.log(`Personal Hub API listening on http://localhost:${PORT}`)
})
