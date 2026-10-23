import { useCallback, useRef } from 'react'

/** Minimum gap between step actions; filters double taps and held-key repeats. */
export const STEP_COOLDOWN_MS = 250

/**
 * Returns a guard that wraps a callback so it runs at most once per `ms`.
 * All wrapped callbacks share one cooldown, so e.g. Next and Back can't fire back-to-back.
 */
export function useCooldown(ms = STEP_COOLDOWN_MS) {
  const lastRun = useRef(-Infinity)
  return useCallback(
    <A extends unknown[]>(fn: (...args: A) => void) =>
      (...args: A) => {
        const now = performance.now()
        if (now - lastRun.current < ms) return
        lastRun.current = now
        fn(...args)
      },
    [ms],
  )
}
