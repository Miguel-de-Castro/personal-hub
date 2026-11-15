import type { DataMode, JobApplication, LearningTopic, LogEntry, Task } from "@/types"

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000"

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  })
  if (!res.ok) {
    throw new Error(`API error ${res.status} on ${path}`)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const api = {
  tasks: {
    list: () => request<Task[]>("/api/tasks"),
    create: (data: Partial<Task>) => request<Task>("/api/tasks", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Task>) =>
      request<Task>(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    remove: (id: string) => request<void>(`/api/tasks/${id}`, { method: "DELETE" }),
  },
  learning: {
    list: () => request<LearningTopic[]>("/api/learning"),
    create: (data: Partial<LearningTopic>) =>
      request<LearningTopic>("/api/learning", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<LearningTopic>) =>
      request<LearningTopic>(`/api/learning/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    remove: (id: string) => request<void>(`/api/learning/${id}`, { method: "DELETE" }),
  },
  jobs: {
    list: () => request<JobApplication[]>("/api/jobs"),
    create: (data: Partial<JobApplication>) =>
      request<JobApplication>("/api/jobs", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<JobApplication>) =>
      request<JobApplication>(`/api/jobs/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    remove: (id: string) => request<void>(`/api/jobs/${id}`, { method: "DELETE" }),
  },
  log: {
    list: () => request<LogEntry[]>("/api/log"),
    create: (data: Partial<LogEntry>) => request<LogEntry>("/api/log", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<LogEntry>) =>
      request<LogEntry>(`/api/log/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    remove: (id: string) => request<void>(`/api/log/${id}`, { method: "DELETE" }),
  },
  settings: {
    get: () => request<{ mode: DataMode }>("/api/settings"),
    setMode: (mode: DataMode) =>
      request<{ mode: DataMode }>("/api/settings", { method: "PATCH", body: JSON.stringify({ mode }) }),
  },
}
