import { createResourceRouter, newId } from "./resource.js"
import type { Task } from "../types.js"
import { boolean, oneOf, optionalDate, optionalText, requiredText, stringList } from "../validate.js"

export const tasksRouter = createResourceRouter<Task>(
  "tasks",
  {
    title: requiredText(300),
    description: optionalText(),
    done: boolean,
    priority: oneOf("low", "medium", "high"),
    dueDate: optionalDate,
    tags: stringList(),
  },
  (body) => ({
    id: newId(),
    title: body.title ?? "Untitled task",
    description: body.description,
    done: body.done ?? false,
    priority: body.priority ?? "medium",
    dueDate: body.dueDate,
    tags: body.tags ?? [],
    createdAt: new Date().toISOString(),
  }),
)
