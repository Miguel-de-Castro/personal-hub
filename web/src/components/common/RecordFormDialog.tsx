import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export type RecordFieldValue = string | number | boolean

export type RecordFieldConfig =
  | {
      name: string
      label: string
      type: "text" | "textarea" | "date" | "url"
      placeholder?: string
      required?: boolean
      defaultValue?: string
      span?: "full" | "half"
    }
  | {
      name: string
      label: string
      type: "number"
      placeholder?: string
      required?: boolean
      defaultValue?: number
      min?: number
      max?: number
      span?: "full" | "half"
    }
  | {
      name: string
      label: string
      type: "select"
      required?: boolean
      defaultValue?: string
      options: { value: string; label: string }[]
      span?: "full" | "half"
    }
  | {
      name: string
      label: string
      type: "checkbox"
      required?: boolean
      defaultValue?: boolean
      span?: "full" | "half"
    }

interface RecordFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  fields: RecordFieldConfig[]
  submitLabel?: string
  onSubmit: (values: Record<string, RecordFieldValue>) => Promise<void> | void
}

function initialValues(fields: RecordFieldConfig[]): Record<string, RecordFieldValue> {
  const values: Record<string, RecordFieldValue> = {}
  for (const field of fields) {
    if (field.type === "checkbox") values[field.name] = field.defaultValue ?? false
    else if (field.type === "number") values[field.name] = field.defaultValue ?? ""
    else values[field.name] = field.defaultValue ?? ""
  }
  return values
}

export function RecordFormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  submitLabel = "Save",
  onSubmit,
}: RecordFormDialogProps) {
  const [values, setValues] = useState<Record<string, RecordFieldValue>>(() => initialValues(fields))
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) setValues(initialValues(fields))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const setValue = (name: string, value: RecordFieldValue) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const requiredMissing = fields.some(
    (field) => field.required && !String(values[field.name] ?? "").trim(),
  )

  const handleSubmit = async () => {
    if (requiredMissing) return
    setSubmitting(true)
    try {
      await onSubmit(values)
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {fields.map((field) => (
            <div
              key={field.name}
              className={cn("flex flex-col gap-1.5", field.span === "half" ? "col-span-1" : "col-span-2")}
            >
              <label htmlFor={field.name} className="font-label text-xs uppercase tracking-widest text-muted-foreground">
                {field.label}
                {field.required ? <span className="text-destructive"> *</span> : null}
              </label>

              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  value={String(values[field.name] ?? "")}
                  placeholder={field.placeholder}
                  onChange={(e) => setValue(field.name, e.target.value)}
                />
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  value={String(values[field.name] ?? "")}
                  onChange={(e) => setValue(field.name, e.target.value)}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-popover text-popover-foreground">
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "checkbox" ? (
                <div className="flex h-8 items-center">
                  <Checkbox
                    id={field.name}
                    checked={Boolean(values[field.name])}
                    onCheckedChange={(checked) => setValue(field.name, checked === true)}
                  />
                </div>
              ) : field.type === "number" ? (
                <Input
                  id={field.name}
                  type="number"
                  min={field.min}
                  max={field.max}
                  value={String(values[field.name] ?? "")}
                  placeholder={field.placeholder}
                  onChange={(e) => setValue(field.name, e.target.value === "" ? "" : Number(e.target.value))}
                />
              ) : (
                <Input
                  id={field.name}
                  type={field.type === "date" ? "date" : field.type === "url" ? "url" : "text"}
                  value={String(values[field.name] ?? "")}
                  placeholder={field.placeholder}
                  onChange={(e) => setValue(field.name, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || requiredMissing} className="shadow-lg shadow-primary/20">
            {submitting ? "Saving…" : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
