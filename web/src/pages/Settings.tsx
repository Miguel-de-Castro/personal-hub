import { useEffect, useState } from "react"
import { FlaskConical, UserRound } from "lucide-react"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import type { DataMode } from "@/types"

const options: { mode: DataMode; title: string; description: string; icon: typeof FlaskConical }[] = [
  {
    mode: "demo",
    title: "Sample data",
    description: "Browse the app pre-filled with example tasks, topics, applications, and log entries. Edits here only change the sample set, never your own data.",
    icon: FlaskConical,
  },
  {
    mode: "live",
    title: "My data",
    description: "Your real tasks, learning topics, job applications, and log entries. Starts empty until you add your own.",
    icon: UserRound,
  },
]

export function Settings() {
  const [mode, setModeState] = useState<DataMode | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.settings.get().then((res) => setModeState(res.mode))
  }, [])

  const selectMode = async (next: DataMode) => {
    if (next === mode || saving) return
    setSaving(true)
    try {
      await api.settings.setMode(next)
      setModeState(next)
      // Every page fetches on mount; a full reload is the simplest way to
      // guarantee nothing on screen is left over from the previous dataset.
      window.location.reload()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="mb-8 text-4xl font-bold text-foreground">Settings</h2>

      <div className="glass-card max-w-2xl rounded-xl p-6">
        <h3 className="mb-1 text-xl font-semibold text-foreground">Data source</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Switch between sample data (to explore the app) and your own data. Nothing is deleted when you switch — each side keeps its own content.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {options.map((option) => {
            const active = mode === option.mode
            return (
              <button
                key={option.mode}
                onClick={() => selectMode(option.mode)}
                disabled={mode === null || saving}
                className={cn(
                  "rounded-xl border p-5 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60",
                  active
                    ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20",
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <option.icon className={cn("size-5", active ? "text-primary" : "text-muted-foreground")} />
                  {active ? (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                      Active
                    </span>
                  ) : null}
                </div>
                <h4 className="mb-1 font-semibold text-foreground">{option.title}</h4>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
