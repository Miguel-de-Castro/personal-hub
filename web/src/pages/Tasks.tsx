import { useState } from "react"
import { AlertTriangle, CalendarClock, CalendarDays, Plus, SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RecordFormDialog, type RecordFieldConfig } from "@/components/common/RecordFormDialog"
import { api } from "@/lib/api"
import { useCollection } from "@/lib/useCollection"
import { cn, parseLocalDate } from "@/lib/utils"
import type { Priority, Task } from "@/types"

const taskFields: RecordFieldConfig[] = [
  { name: "title", label: "Title", type: "text", placeholder: "What needs to get done?", required: true },
  { name: "description", label: "Description", type: "textarea", placeholder: "Add more detail (optional)" },
  {
    name: "priority",
    label: "Priority",
    type: "select",
    defaultValue: "medium",
    span: "half",
    options: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
    ],
  },
  { name: "dueDate", label: "Due Date", type: "date", span: "half" },
  { name: "tags", label: "Tags", type: "text", placeholder: "comma, separated, tags" },
]

const priorityClasses: Record<Priority, string> = {
  high: "bg-destructive/20 text-destructive border-destructive/30",
  medium: "bg-tertiary/20 text-tertiary border-tertiary/30",
  low: "bg-primary/20 text-primary border-primary/30",
}

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDue(dueDate?: string) {
  if (!dueDate) return { label: "No due date", sub: "" }
  const due = startOfDay(parseLocalDate(dueDate))
  const today = startOfDay(new Date())
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000)
  const label = due.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  if (diffDays < 0) return { label, sub: `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? "" : "s"} late` }
  if (diffDays === 0) return { label, sub: "Today" }
  return { label, sub: due.toLocaleDateString("en-US", { weekday: "short" }) }
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: (task: Task) => void }) {
  const { label, sub } = formatDue(task.dueDate)
  return (
    <div className="glass-card flex items-center justify-between rounded-xl p-5">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onToggle(task)}
          aria-pressed={task.done}
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
            task.done ? "border-primary bg-primary" : "border-white/10 hover:border-primary",
          )}
        />
        <div>
          <h4 className={cn("text-base text-foreground", task.done && "text-muted-foreground line-through")}>{task.title}</h4>
          <div className="mt-1 flex flex-wrap gap-2">
            <Badge variant="outline" className={cn("rounded text-[10px] font-bold uppercase tracking-wider", priorityClasses[task.priority])}>
              {task.priority} priority
            </Badge>
            {task.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="rounded border-white/10 bg-muted text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  )
}

function TaskGroup({
  title,
  icon: Icon,
  accent,
  tasks,
  onToggle,
}: {
  title: string
  icon: typeof AlertTriangle
  accent: string
  tasks: Task[]
  onToggle: (task: Task) => void
}) {
  if (tasks.length === 0) return null
  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        <Icon className={cn("size-4", accent)} />
        <h3 className={cn("font-label text-xs uppercase tracking-widest", accent)}>{title}</h3>
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} onToggle={onToggle} />
        ))}
      </div>
    </div>
  )
}

export function Tasks() {
  const { data: tasks, setData, loading } = useCollection(api.tasks.list)
  const [addOpen, setAddOpen] = useState(false)

  const createTask = async (values: Record<string, string | number | boolean>) => {
    const task = await api.tasks.create({
      title: String(values.title).trim(),
      description: String(values.description ?? "").trim() || undefined,
      priority: values.priority as Priority,
      dueDate: String(values.dueDate ?? "").trim() || undefined,
      tags: String(values.tags ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      done: false,
    })
    setData((prev) => [...prev, task])
  }

  const toggle = (task: Task) => {
    const done = !task.done
    setData((prev) => prev.map((t) => (t.id === task.id ? { ...t, done } : t)))
    api.tasks.update(task.id, { done }).catch(() => {
      setData((prev) => prev.map((t) => (t.id === task.id ? { ...t, done: task.done } : t)))
    })
  }

  const today = startOfDay(new Date())
  const pending = tasks.filter((t) => !t.done)
  const overdue = pending.filter((t) => t.dueDate && startOfDay(parseLocalDate(t.dueDate)) < today)
  const dueToday = pending.filter((t) => t.dueDate && startOfDay(parseLocalDate(t.dueDate)).getTime() === today.getTime())
  const upcoming = pending.filter((t) => !overdue.includes(t) && !dueToday.includes(t))

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-4xl font-bold text-foreground">My Tasks</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {pending.length} active · {dueToday.length} due today
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 text-muted-foreground hover:bg-white/5 hover:text-foreground">
            <SlidersHorizontal className="size-4" />
            Filter
          </Button>
          <Button className="shadow-lg shadow-primary/20" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            New Task
          </Button>
        </div>
      </div>

      <RecordFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="New Task"
        description="Add a task to your list."
        fields={taskFields}
        submitLabel="Create Task"
        onSubmit={createTask}
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading tasks…</p>
      ) : (
        <>
          <TaskGroup title="Overdue" icon={AlertTriangle} accent="text-destructive" tasks={overdue} onToggle={toggle} />
          <TaskGroup title="Today" icon={CalendarClock} accent="text-tertiary" tasks={dueToday} onToggle={toggle} />
          <TaskGroup title="Upcoming" icon={CalendarDays} accent="text-muted-foreground" tasks={upcoming} onToggle={toggle} />
        </>
      )}
    </div>
  )
}
