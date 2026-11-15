import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses a "YYYY-MM-DD" date as a *local* calendar day. `new Date("2026-07-22")`
 * is read as UTC midnight, which shows up as July 21 in timezones west of UTC
 * (e.g. Brazil).
 */
export function parseLocalDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

/** Today as "YYYY-MM-DD" in the local timezone. */
export function localToday(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/**
 * Returns the URL only if it's http(s). Anything else (notably `javascript:`)
 * would run script when the link is clicked, so it isn't rendered as a link.
 */
export function safeHttpUrl(value?: string): string | undefined {
  if (!value) return undefined
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:" ? value : undefined
  } catch {
    return undefined
  }
}
