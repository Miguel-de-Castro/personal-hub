import { useState } from "react"
import { Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RecordFormDialog, type RecordFieldConfig } from "@/components/common/RecordFormDialog"
import { api } from "@/lib/api"
import { useCollection } from "@/lib/useCollection"
import { cn } from "@/lib/utils"
import type { LearningStatus } from "@/types"

const statusLabels: Record<LearningStatus, string> = {
  "in-progress": "In Progress",
  completed: "Completed",
  "to-learn": "To Learn",
}

const statusClasses: Record<LearningStatus, string> = {
  "in-progress": "bg-tertiary/20 text-tertiary border-tertiary/30",
  completed: "bg-secondary/20 text-secondary border-secondary/30",
  "to-learn": "bg-muted text-muted-foreground border-white/10",
}

const learningFields: RecordFieldConfig[] = [
  { name: "title", label: "Title", type: "text", placeholder: "e.g. Advanced TypeScript", required: true },
  { name: "description", label: "Description", type: "textarea", placeholder: "What are you learning? (optional)" },
  {
    name: "status",
    label: "Status",
    type: "select",
    defaultValue: "to-learn",
    span: "half",
    options: [
      { value: "to-learn", label: "To Learn" },
      { value: "in-progress", label: "In Progress" },
      { value: "completed", label: "Completed" },
    ],
  },
  { name: "progress", label: "Progress (%)", type: "number", defaultValue: 0, min: 0, max: 100, span: "half" },
]

export function Learning() {
  const { data: topics, setData, loading } = useCollection(api.learning.list)
  const [addOpen, setAddOpen] = useState(false)

  const activeCount = topics.filter((t) => t.status !== "completed").length

  const createTopic = async (values: Record<string, string | number | boolean>) => {
    const topic = await api.learning.create({
      title: String(values.title).trim(),
      description: String(values.description ?? "").trim() || undefined,
      status: values.status as LearningStatus,
      progress: Number(values.progress) || 0,
      resources: [],
    })
    setData((prev) => [...prev, topic])
  }

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-4xl font-bold text-foreground">Learning Path</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Track your professional growth across multiple disciplines. Manage courses, documentation, and skill acquisition in one place.
          </p>
        </div>
        <div className="flex items-center gap-8">
          <div>
            <p className="font-label text-xs text-muted-foreground">TOPICS ACTIVE</p>
            <p className="text-xl font-bold text-foreground">{activeCount}</p>
          </div>
          <Button
            className="bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20 hover:bg-secondary/90"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="size-4" />
            Add Topic
          </Button>
        </div>
      </div>

      <RecordFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Topic"
        description="Add something new you want to learn."
        fields={learningFields}
        submitLabel="Add Topic"
        onSubmit={createTopic}
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading topics…</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {topics.map((topic) => (
            <div key={topic.id} className="glass-card flex flex-col justify-between rounded-xl p-6">
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <Badge variant="outline" className={cn("rounded text-[10px] font-bold uppercase tracking-wider", statusClasses[topic.status])}>
                    {statusLabels[topic.status]}
                  </Badge>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{topic.title}</h3>
                {topic.description ? <p className="mb-6 text-sm text-muted-foreground">{topic.description}</p> : null}
              </div>
              <div>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-foreground">{topic.progress}%</span>
                </div>
                <Progress value={topic.progress} />
              </div>
            </div>
          ))}

          {topics.length === 0 ? (
            <div className="glass-card col-span-full rounded-xl p-10 text-center text-sm text-muted-foreground">
              No topics yet. Add your first thing you want to learn.
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
