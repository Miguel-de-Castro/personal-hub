import { useState } from "react"
import { ArrowRight, Bold, Italic, Link2, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { useCollection } from "@/lib/useCollection"
import { cn, localToday, parseLocalDate } from "@/lib/utils"

const moods = ["😄", "🙂", "😕"]

export function Log() {
  const { data: entries, setData, loading } = useCollection(api.log.list)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [mood, setMood] = useState(0)
  const [saving, setSaving] = useState(false)

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))

  const save = async () => {
    if (!title.trim() && !body.trim()) return
    setSaving(true)
    try {
      const entry = await api.log.create({
        date: localToday(),
        title: title.trim() || "Untitled entry",
        body,
        mood,
        tags: [],
      })
      setData((prev) => [entry, ...prev])
      setTitle("")
      setBody("")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <section className="space-y-6 lg:col-span-4">
          <div>
            <h3 className="mb-4 text-xl font-semibold text-foreground">Past Entries</h3>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading entries…</p>
            ) : (
              <div className="space-y-4">
                {sorted.map((entry) => (
                  <div key={entry.id} className="glass-card block w-full rounded-xl p-5 text-left">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-label text-xs text-primary">
                        {parseLocalDate(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
                      </span>
                      <ArrowRight className="size-4 text-muted-foreground" />
                    </div>
                    <h4 className="mb-1 font-semibold text-foreground">{entry.title}</h4>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{entry.body}</p>
                  </div>
                ))}

                {sorted.length === 0 ? (
                  <div className="glass-card rounded-xl p-6 text-center text-sm text-muted-foreground">No entries yet — write your first one.</div>
                ) : null}
              </div>
            )}
          </div>
        </section>

        <section className="lg:col-span-8">
          <div className="glass-card rounded-xl p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
              <span className="font-label text-xs uppercase tracking-widest text-primary">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </span>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Bold className="size-4" />
                <Italic className="size-4" />
                <List className="size-4" />
                <Link2 className="size-4" />
                <Button onClick={save} disabled={saving} className="ml-2 shadow-lg shadow-primary/20">
                  {saving ? "Saving…" : "Save Entry"}
                </Button>
              </div>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entry Title..."
              className="mb-4 w-full border-none bg-transparent text-3xl font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
            />
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Start writing today's log..."
              className="min-h-[240px] resize-none border-none bg-transparent p-0 text-base text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-0"
            />

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">MOOD</span>
                {moods.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => setMood(i)}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full border text-base",
                      mood === i ? "border-primary bg-primary/10" : "border-transparent opacity-60",
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
