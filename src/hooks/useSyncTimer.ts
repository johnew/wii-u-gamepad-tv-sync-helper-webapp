import { useCallback, useEffect, useState } from 'react'
import { remainingSyncSeconds, SYNC_DURATION_MS } from '../lib/syncTimer'

export function useSyncTimer() {
  const [deadline, setDeadline] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now)
  const remaining = remainingSyncSeconds(deadline, now)

  useEffect(() => {
    if (deadline === null) return
    const update = () => setNow(Date.now())
    const interval = window.setInterval(update, 250)
    document.addEventListener('visibilitychange', update)
    window.addEventListener('focus', update)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', update)
      window.removeEventListener('focus', update)
    }
  }, [deadline])

  const start = useCallback(() => {
    const startedAt = Date.now()
    setNow(startedAt)
    setDeadline(startedAt + SYNC_DURATION_MS)
  }, [])

  // Check the deadline at the action too, even if a background tab delayed the display update.
  const canAdvance = useCallback(
    () => remainingSyncSeconds(deadline, Date.now()) > 0,
    [deadline],
  )

  return { remaining, started: deadline !== null, start, canAdvance }
}
