import { Router } from "express"
import { getMode, setMode } from "../db.js"
import type { DataMode } from "../types.js"

export const settingsRouter = Router()

settingsRouter.get("/", async (_req, res) => {
  res.json({ mode: await getMode() })
})

settingsRouter.patch("/", async (req, res) => {
  const mode = req.body?.mode as DataMode
  if (mode !== "demo" && mode !== "live") {
    res.status(400).json({ error: "mode must be 'demo' or 'live'" })
    return
  }
  await setMode(mode)
  res.json({ mode })
})
