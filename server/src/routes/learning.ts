import { createResourceRouter, newId } from "./resource.js"
import type { LearningTopic } from "../types.js"
import { linkList, oneOf, optionalText, percent, requiredText } from "../validate.js"

export const learningRouter = createResourceRouter<LearningTopic>(
  "learningTopics",
  {
    title: requiredText(300),
    description: optionalText(),
    status: oneOf("to-learn", "in-progress", "completed"),
    progress: percent,
    resources: linkList,
  },
  (body) => ({
    id: newId(),
    title: body.title ?? "Untitled topic",
    description: body.description,
    status: body.status ?? "to-learn",
    progress: body.progress ?? 0,
    resources: body.resources ?? [],
    createdAt: new Date().toISOString(),
  }),
)
