import { useCallback, useEffect, useState } from "react"

/**
 * Loads a list from the API on mount and exposes setData so callers can
 * apply optimistic updates (toggle a checkbox, drop a new item in) without
 * waiting on a refetch.
 */
export function useCollection<T>(fetcher: () => Promise<T[]>) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    fetcher()
      .then((items) => setData(items))
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { data, setData, loading, error, reload }
}
