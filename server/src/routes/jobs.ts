import { createResourceRouter, newId } from "./resource.js"
import type { JobApplication } from "../types.js"
import { boolean, oneOf, optionalDate, optionalHttpUrl, optionalText, requiredText } from "../validate.js"

export const jobsRouter = createResourceRouter<JobApplication>(
  "jobApplications",
  {
    company: requiredText(200),
    role: requiredText(200),
    stage: oneOf("wishlist", "applied", "interviewing", "offer", "closed"),
    url: optionalHttpUrl,
    location: optionalText(200),
    salaryRange: optionalText(100),
    notes: optionalText(),
    highPriority: boolean,
    appliedDate: optionalDate,
  },
  (body) => ({
    id: newId(),
    company: body.company ?? "Unknown company",
    role: body.role ?? "Untitled role",
    stage: body.stage ?? "wishlist",
    url: body.url,
    location: body.location,
    salaryRange: body.salaryRange,
    notes: body.notes,
    highPriority: body.highPriority ?? false,
    appliedDate: body.appliedDate,
    createdAt: new Date().toISOString(),
  }),
)
