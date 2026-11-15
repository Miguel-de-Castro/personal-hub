import { useState } from "react"
import { CalendarClock, Link2, MoreHorizontal, Plus, SlidersHorizontal } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RecordFormDialog, type RecordFieldConfig } from "@/components/common/RecordFormDialog"
import { api } from "@/lib/api"
import { useCollection } from "@/lib/useCollection"
import { cn, safeHttpUrl } from "@/lib/utils"
import type { JobApplication, JobStage } from "@/types"

const stages: { key: JobStage; label: string; dot: string }[] = [
  { key: "wishlist", label: "Wishlist", dot: "bg-muted-foreground" },
  { key: "applied", label: "Applied", dot: "bg-primary" },
  { key: "interviewing", label: "Interviewing", dot: "bg-secondary" },
  { key: "offer", label: "Offer", dot: "bg-emerald-400" },
]

const jobFields: RecordFieldConfig[] = [
  { name: "company", label: "Company", type: "text", placeholder: "Acme Inc.", required: true, span: "half" },
  { name: "role", label: "Role", type: "text", placeholder: "Software Engineer", required: true, span: "half" },
  {
    name: "stage",
    label: "Stage",
    type: "select",
    defaultValue: "wishlist",
    span: "half",
    options: stages.map((s) => ({ value: s.key, label: s.label })),
  },
  { name: "salaryRange", label: "Salary Range", type: "text", placeholder: "e.g. $90k–110k", span: "half" },
  { name: "location", label: "Location", type: "text", placeholder: "Remote / City", span: "half" },
  { name: "url", label: "Job URL", type: "url", placeholder: "https://…", span: "half" },
  { name: "notes", label: "Notes", type: "text", placeholder: "e.g. next round Friday" },
  { name: "highPriority", label: "High Priority", type: "checkbox" },
]

const avatarPalette = [
  "bg-primary/20 text-primary",
  "bg-secondary/20 text-secondary",
  "bg-tertiary/20 text-tertiary",
  "bg-emerald-500/20 text-emerald-400",
]

function avatarClass(company: string) {
  const index = company.charCodeAt(0) % avatarPalette.length
  return avatarPalette[index]
}

export function Jobs() {
  const { data: applications, setData, loading } = useCollection(api.jobs.list)
  const [addOpen, setAddOpen] = useState(false)
  const active = applications.filter((a) => a.stage !== "closed")

  const byStage = (stage: JobStage) => active.filter((a) => a.stage === stage)

  const createApplication = async (values: Record<string, string | number | boolean>) => {
    const application = await api.jobs.create({
      company: String(values.company).trim(),
      role: String(values.role).trim(),
      stage: values.stage as JobStage,
      salaryRange: String(values.salaryRange ?? "").trim() || undefined,
      location: String(values.location ?? "").trim() || undefined,
      url: String(values.url ?? "").trim() || undefined,
      notes: String(values.notes ?? "").trim() || undefined,
      highPriority: Boolean(values.highPriority),
    })
    setData((prev) => [...prev, application])
  }

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-4xl font-bold text-foreground">Job Application Pipeline</h2>
          <p className="mt-2 text-sm text-muted-foreground">Track your professional journey across {active.length} active applications.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 text-muted-foreground hover:bg-white/5 hover:text-foreground">
            <SlidersHorizontal className="size-4" />
            Filter
          </Button>
          <Button className="shadow-lg shadow-primary/20" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            Add Application
          </Button>
        </div>
      </div>

      <RecordFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Application"
        description="Track a new job application."
        fields={jobFields}
        submitLabel="Add Application"
        onSubmit={createApplication}
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading applications…</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage) => (
            <div key={stage.key} className="min-w-0">
              <div className="mb-4 flex items-center gap-2">
                <span className={cn("size-2 rounded-full", stage.dot)} />
                <h3 className="font-label text-xs uppercase tracking-widest text-muted-foreground">{stage.label}</h3>
                <span className="ml-auto flex size-5 items-center justify-center rounded bg-muted text-[10px] font-semibold text-muted-foreground">
                  {byStage(stage.key).length}
                </span>
              </div>

              <div className="space-y-4">
                {byStage(stage.key).map((app: JobApplication) => (
                  <div key={app.id} className="glass-card rounded-xl p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <Avatar className={cn("size-9 rounded-lg", avatarClass(app.company))}>
                        <AvatarFallback className={cn("rounded-lg font-semibold", avatarClass(app.company))}>
                          {app.company.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {safeHttpUrl(app.url) ? (
                        <a href={safeHttpUrl(app.url)} target="_blank" rel="noreferrer">
                          <Link2 className="size-4 text-primary" />
                        </a>
                      ) : null}
                    </div>
                    <h4 className="text-base font-semibold text-foreground">{app.role}</h4>
                    <p className="text-sm text-muted-foreground">{app.company}</p>

                    {app.notes ? (
                      <div className="mt-3 flex items-center gap-2 rounded-lg bg-secondary/10 px-3 py-2 text-xs font-medium text-secondary">
                        <CalendarClock className="size-3.5" />
                        {app.notes.toUpperCase()}
                      </div>
                    ) : null}

                    <div className="mt-3 flex items-center justify-between">
                      {app.highPriority ? (
                        <Badge variant="outline" className="rounded border-tertiary/30 bg-tertiary/20 text-[10px] font-bold uppercase tracking-wider text-tertiary">
                          High Priority
                        </Badge>
                      ) : app.salaryRange ? (
                        <span className="text-xs text-muted-foreground">{app.salaryRange}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">{app.appliedDate ? `Applied ${app.appliedDate}` : ""}</span>
                      )}
                      <MoreHorizontal className="size-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}

                {byStage(stage.key).length === 0 ? (
                  <div className="glass-card rounded-xl p-5 text-center text-xs text-muted-foreground">Nothing here yet</div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
