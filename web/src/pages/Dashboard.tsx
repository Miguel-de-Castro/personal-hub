import { useEffect, useState } from "react"
import { CalendarDays, ClipboardList, GraduationCap, TrendingUp, Zap, Flame, LineChart, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { parseLocalDate } from "@/lib/utils"
import type { JobApplication, LearningTopic, Priority, Task } from "@/types"

const priorityClasses: Record<Priority, string> = {
  high: "bg-destructive/20 text-destructive border-destructive/30",
  medium: "bg-tertiary/20 text-tertiary border-tertiary/30",
  low: "bg-primary/20 text-primary border-primary/30",
}

const velocityColors = ["bg-primary text-primary", "bg-secondary text-secondary", "bg-tertiary text-tertiary"]

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [topics, setTopics] = useState<LearningTopic[]>([])
  const [jobs, setJobs] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.tasks.list(), api.learning.list(), api.jobs.list()])
      .then(([t, l, j]) => {
        setTasks(t)
        setTopics(l)
        setJobs(j)
      })
      .finally(() => setLoading(false))
  }, [])

  const today = startOfDay(new Date())
  const pending = tasks.filter((t) => !t.done)
  const overdueCount = pending.filter((t) => t.dueDate && startOfDay(parseLocalDate(t.dueDate)) < today).length
  const focusTasks = pending.slice(0, 3)

  const activeTopics = topics.filter((t) => t.status !== "completed")
  const activeJobs = jobs.filter((j) => j.stage !== "closed")

  const stats = [
    {
      label: "Tasks Due",
      value: String(pending.length).padStart(2, "0"),
      icon: ClipboardList,
      accent: "text-primary",
      detail: `${overdueCount} overdue`,
      detailIcon: TrendingUp,
      detailClass: "text-destructive",
    },
    {
      label: "Active Topics",
      value: String(activeTopics.length).padStart(2, "0"),
      icon: GraduationCap,
      accent: "text-secondary",
      detail: activeTopics.map((t) => t.title).slice(0, 3).join(", ") || "Nothing in progress",
      detailClass: "italic text-muted-foreground",
    },
    {
      label: "Open Jobs",
      value: String(activeJobs.length).padStart(2, "0"),
      icon: Briefcase,
      accent: "text-tertiary",
      detail: `${jobs.filter((j) => j.stage === "interviewing").length} in interviews`,
      detailIcon: Zap,
      detailClass: "text-muted-foreground",
    },
    {
      label: "In Progress",
      value: String(topics.filter((t) => t.status === "in-progress").length).padStart(2, "0"),
      icon: Flame,
      accent: "text-primary",
      detail: "Learning topics",
      detailClass: "text-muted-foreground",
    },
  ]

  return (
    <div>
      <section className="mb-10">
        <h2 className="mb-2 text-4xl font-bold text-foreground md:text-5xl">Good morning.</h2>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="size-4" />
          <span className="font-label text-xs uppercase tracking-widest">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
      </section>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading dashboard…</p>
      ) : (
        <>
          <section className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card flex min-h-[140px] flex-col justify-between rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <span className="font-label text-xs text-muted-foreground">{stat.label.toUpperCase()}</span>
                  <stat.icon className={`size-5 ${stat.accent}`} />
                </div>
                <div>
                  <div className="text-4xl font-bold text-foreground">{stat.value}</div>
                  <div className={`mt-1 flex items-center gap-1 truncate text-xs ${stat.detailClass}`}>
                    {stat.detailIcon ? <stat.detailIcon className="size-3 shrink-0" /> : null}
                    <span className="truncate">{stat.detail}</span>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <section className="space-y-6 lg:col-span-8">
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-semibold text-foreground">Daily Focus</h3>
                <Button variant="link" className="text-primary" render={<a href="/tasks" />}>
                  View All Tasks
                </Button>
              </div>

              <div className="space-y-4">
                {focusTasks.map((task) => (
                  <div key={task.id} className="glass-card flex items-center justify-between rounded-xl p-5">
                    <div className="flex items-center gap-4">
                      <div className="size-6 shrink-0 cursor-pointer rounded-md border-2 border-white/10 transition-all hover:border-primary" />
                      <div>
                        <h4 className="text-base text-foreground">{task.title}</h4>
                        <div className="mt-1 flex gap-2">
                          <Badge variant="outline" className={`rounded text-[10px] font-bold uppercase tracking-wider ${priorityClasses[task.priority]}`}>
                            {task.priority}
                          </Badge>
                          {task.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="rounded border-white/10 bg-muted text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {focusTasks.length === 0 ? (
                  <div className="glass-card rounded-xl p-6 text-center text-sm text-muted-foreground">Nothing pending — you're all caught up.</div>
                ) : null}
              </div>

              <div className="mt-10">
                <h3 className="mb-6 text-2xl font-semibold text-foreground">Job Pipeline Summary</h3>
                <div className="glass-card overflow-hidden rounded-xl p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5 text-left">
                        <th className="pb-4 font-label text-xs text-muted-foreground">COMPANY</th>
                        <th className="pb-4 font-label text-xs text-muted-foreground">POSITION</th>
                        <th className="pb-4 font-label text-xs text-muted-foreground">STAGE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {activeJobs.slice(0, 4).map((job) => (
                        <tr key={job.id} className="transition-colors hover:bg-white/5">
                          <td className="py-4 font-medium text-foreground">{job.company}</td>
                          <td className="py-4 text-muted-foreground">{job.role}</td>
                          <td className="py-4 capitalize">{job.stage}</td>
                        </tr>
                      ))}
                      {activeJobs.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-6 text-center text-sm text-muted-foreground">
                            No active applications yet.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="space-y-8 lg:col-span-4">
              <div className="glass-card rounded-xl p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-foreground">Learning Velocity</h3>
                  <LineChart className="size-5 text-muted-foreground" />
                </div>
                <div className="space-y-6">
                  {activeTopics.slice(0, 3).map((topic, i) => {
                    const [bar, text] = velocityColors[i % velocityColors.length].split(" ")
                    return (
                      <div key={topic.id}>
                        <div className="mb-2 flex justify-between text-xs">
                          <span className="font-medium text-foreground">{topic.title}</span>
                          <span className={text}>{topic.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div className={`h-full rounded-full ${bar}`} style={{ width: `${topic.progress}%` }} />
                        </div>
                      </div>
                    )
                  })}
                  {activeTopics.length === 0 ? <p className="text-sm text-muted-foreground">No active topics.</p> : null}
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  )
}
