export type Priority = "low" | "medium" | "high"

export interface Task {
  id: string
  title: string
  description?: string
  done: boolean
  priority: Priority
  dueDate?: string
  tags: string[]
  createdAt: string
}

export type LearningStatus = "to-learn" | "in-progress" | "completed"

export interface LearningTopic {
  id: string
  title: string
  description?: string
  status: LearningStatus
  progress: number
  resources: { label: string; url: string }[]
  createdAt: string
}

export type JobStage = "wishlist" | "applied" | "interviewing" | "offer" | "closed"

export interface JobApplication {
  id: string
  company: string
  role: string
  stage: JobStage
  url?: string
  location?: string
  salaryRange?: string
  notes?: string
  highPriority: boolean
  appliedDate?: string
  createdAt: string
}

export type DataMode = "demo" | "live"

export interface LogEntry {
  id: string
  date: string
  title: string
  body: string
  mood?: number
  tags: string[]
  createdAt: string
}
