export type Priority = "low" | "medium" | "high"

export interface Task {
  id: string
  title: string
  description?: string
  done: boolean
  priority: Priority
  dueDate?: string // ISO date
  tags: string[]
  createdAt: string
}

export type LearningStatus = "to-learn" | "in-progress" | "completed"

export interface LearningTopic {
  id: string
  title: string
  description?: string
  status: LearningStatus
  progress: number // 0-100
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

export interface LogEntry {
  id: string
  date: string // YYYY-MM-DD
  title: string
  body: string
  mood?: number // index into a small mood scale
  tags: string[]
  createdAt: string
}

export interface Database {
  tasks: Task[]
  learningTopics: LearningTopic[]
  jobApplications: JobApplication[]
  logEntries: LogEntry[]
}

export type DataMode = "demo" | "live"

export interface StoredData {
  mode: DataMode
  demo: Database
  live: Database
}
