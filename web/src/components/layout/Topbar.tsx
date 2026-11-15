import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Bell, FlaskConical, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { DataMode } from "@/types"

export function Topbar({
  searchPlaceholder = "Search tasks, jobs, or notes...",
}: {
  searchPlaceholder?: string
}) {
  const [mode, setMode] = useState<DataMode | null>(null)

  useEffect(() => {
    api.settings.get().then((res) => setMode(res.mode))
  }, [])

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/5 bg-background/50 px-6 backdrop-blur-md md:px-10">
      <div className="flex items-center gap-3">
        <div className="flex w-full max-w-96 items-center gap-3 rounded-lg border border-white/5 bg-muted px-4 py-2">
          <Search className="size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full border-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
          />
        </div>
        {mode === "demo" ? (
          <Link
            to="/settings"
            className="hidden shrink-0 items-center gap-1.5 rounded-full border border-tertiary/30 bg-tertiary/10 px-3 py-1.5 text-xs font-medium text-tertiary sm:flex"
          >
            <FlaskConical className="size-3.5" />
            Sample data
          </Link>
        ) : null}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2 text-muted-foreground transition-colors hover:text-primary">
          <Bell className="size-5" />
        </button>
        <div className="mx-1 hidden h-6 w-px bg-white/10 sm:block" />
        <Button variant="secondary" className="hidden sm:inline-flex">
          Quick Log
        </Button>
        <Button className="shadow-lg shadow-primary/20">New Task</Button>
      </div>
    </header>
  )
}
