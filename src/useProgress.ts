import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'wiiu-sync-helper-progress-v1'

export interface Progress {
  current: number
  tried: number[]
  found: number | null
}

const initial: Progress = { current: 0, tried: [], found: null }

function load(total: number): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initial
    const parsed = JSON.parse(raw) as Partial<Progress>
    const inRange = (n: unknown): n is number =>
      typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < total
    return {
      current: inRange(parsed.current) ? parsed.current : 0,
      tried: Array.isArray(parsed.tried) ? parsed.tried.filter(inRange) : [],
      found: inRange(parsed.found) ? parsed.found : null,
    }
  } catch {
    return initial
  }
}

export function useProgress(total: number) {
  const [progress, setProgress] = useState<Progress>(() => load(total))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const triedSet = new Set(progress.tried)

  const goTo = useCallback(
    (index: number) =>
      setProgress((p) => ({ ...p, current: Math.max(0, Math.min(total - 1, index)) })),
    [total],
  )

  const markTriedAndNext = useCallback(
    () =>
      setProgress((p) => ({
        ...p,
        tried: p.tried.includes(p.current) ? p.tried : [...p.tried, p.current],
        current: Math.min(total - 1, p.current + 1),
      })),
    [total],
  )

  const back = useCallback(
    () => setProgress((p) => ({ ...p, current: Math.max(0, p.current - 1) })),
    [],
  )

  const toggleTried = useCallback(
    (index: number) =>
      setProgress((p) => ({
        ...p,
        tried: p.tried.includes(index)
          ? p.tried.filter((i) => i !== index)
          : [...p.tried, index],
      })),
    [],
  )

  const markFound = useCallback(
    () => setProgress((p) => ({ ...p, found: p.current })),
    [],
  )

  const clearFound = useCallback(() => setProgress((p) => ({ ...p, found: null })), [])

  const reset = useCallback(() => setProgress(initial), [])

  return {
    progress,
    triedSet,
    goTo,
    markTriedAndNext,
    back,
    toggleTried,
    markFound,
    clearFound,
    reset,
  }
}
