import { useEffect, useState } from 'react'

/** Keeps the screen awake while the page is visible (where the Screen Wake Lock API is supported). */
export function useWakeLock(enabled: boolean) {
  const supported = typeof navigator !== 'undefined' && 'wakeLock' in navigator
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!supported || !enabled) return
    let sentinel: WakeLockSentinel | null = null
    let cancelled = false

    async function acquire() {
      if (document.visibilityState !== 'visible' || sentinel) return
      try {
        const lock = await navigator.wakeLock.request('screen')
        if (cancelled) {
          await lock.release()
          return
        }
        sentinel = lock
        setActive(true)
        lock.addEventListener('release', () => {
          sentinel = null
          setActive(false)
        })
      } catch {
        setActive(false)
      }
    }

    // The browser drops the lock when the tab is hidden, so re-acquire on return
    document.addEventListener('visibilitychange', acquire)
    void acquire()

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', acquire)
      void sentinel?.release()
      sentinel = null
      setActive(false)
    }
  }, [supported, enabled])

  return { supported, active }
}
