/**
 * Minimal request-body validation, no dependencies.
 *
 * Each resource declares the fields a client may set and how to check them.
 * Anything not declared (including `id`, `createdAt`, `__proto__`) is dropped,
 * so a request can never write arbitrary keys into the JSON store.
 */

export class ValidationError extends Error {}

/** Returns the cleaned value, or throws ValidationError. `undefined` means "not provided". */
export type Validator = (value: unknown, field: string) => unknown

export type Schema = Record<string, Validator>

const MAX_TEXT = 10_000

function fail(field: string, expected: string): never {
  throw new ValidationError(`"${field}" must be ${expected}`)
}

export const text =
  (max = MAX_TEXT): Validator =>
  (v, f) => {
    if (typeof v !== "string") fail(f, "a string")
    if (v.length > max) fail(f, `at most ${max} characters`)
    return v
  }

/** Like text(), but must contain something other than whitespace (titles, names). */
export const requiredText =
  (max = MAX_TEXT): Validator =>
  (v, f) => {
    const value = text(max)(v, f) as string
    if (!value.trim()) fail(f, "a non-empty string")
    return value
  }

/** Like text(), but `null` or "" clears the field. */
export const optionalText =
  (max = MAX_TEXT): Validator =>
  (v, f) =>
    v === null || v === "" ? null : text(max)(v, f)

export const boolean: Validator = (v, f) => (typeof v === "boolean" ? v : fail(f, "true or false"))

export const oneOf =
  (...allowed: string[]): Validator =>
  (v, f) =>
    typeof v === "string" && allowed.includes(v) ? v : fail(f, `one of: ${allowed.join(", ")}`)

export const integer =
  (min: number, max: number): Validator =>
  (v, f) =>
    Number.isInteger(v) && (v as number) >= min && (v as number) <= max ? v : fail(f, `an integer from ${min} to ${max}`)

export const optionalInteger =
  (min: number, max: number): Validator =>
  (v, f) =>
    v === null ? null : integer(min, max)(v, f)

/** A percentage: any finite number, rounded and clamped to 0–100. */
export const percent: Validator = (v, f) =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(100, Math.max(0, Math.round(v))) : fail(f, "a number from 0 to 100")

/** A calendar date as YYYY-MM-DD. `null` or "" clears it. */
export const optionalDate: Validator = (v, f) => {
  if (v === null || v === "") return null
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) fail(f, "a date as YYYY-MM-DD")
  // Must be a real calendar day: 2026-02-30 or 2026-99-99 are rejected.
  const [y, m, d] = v.split("-").map(Number)
  const day = new Date(Date.UTC(y, m - 1, d))
  if (day.getUTCFullYear() !== y || day.getUTCMonth() !== m - 1 || day.getUTCDate() !== d) {
    fail(f, "a real calendar date")
  }
  return v
}

export const date: Validator = (v, f) => optionalDate(v, f) ?? fail(f, "a date as YYYY-MM-DD")

/** Only http(s) links: a `javascript:` URL rendered as a link would run script when clicked. */
export const optionalHttpUrl: Validator = (v, f) => {
  if (v === null || v === "") return null
  if (typeof v !== "string" || v.length > 2_000) fail(f, "a URL")
  let url: URL
  try {
    url = new URL(v)
  } catch {
    fail(f, "a valid URL starting with http:// or https://")
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") fail(f, "an http:// or https:// URL")
  return v
}

export const stringList =
  (maxItems = 50, maxLength = 100): Validator =>
  (v, f) => {
    if (!Array.isArray(v) || v.length > maxItems) fail(f, `a list of at most ${maxItems} strings`)
    return v.map((item) => text(maxLength)(item, f))
  }

export const linkList: Validator = (v, f) => {
  if (!Array.isArray(v) || v.length > 50) fail(f, "a list of at most 50 links")
  return v.map((item) => {
    if (typeof item !== "object" || item === null) fail(f, "a list of { label, url } objects")
    const { label, url } = item as Record<string, unknown>
    return { label: text(200)(label, `${f}.label`), url: optionalHttpUrl(url, `${f}.url`) ?? fail(`${f}.url`, "a URL") }
  })
}

/**
 * Picks and validates the declared fields from a request body. A field that
 * comes back as `null` is reported as `undefined`, meaning "clear this field".
 */
export function parseBody(body: unknown, schema: Schema): Record<string, unknown> {
  if (body !== undefined && (typeof body !== "object" || body === null || Array.isArray(body))) {
    throw new ValidationError("Request body must be a JSON object")
  }
  const input = (body ?? {}) as Record<string, unknown>
  const clean: Record<string, unknown> = {}
  for (const [field, validate] of Object.entries(schema)) {
    if (!Object.prototype.hasOwnProperty.call(input, field) || input[field] === undefined) continue
    const value = validate(input[field], field)
    clean[field] = value === null ? undefined : value
  }
  return clean
}
