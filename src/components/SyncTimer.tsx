import { SYNC_DURATION_MS } from '../lib/syncTimer'

interface Props {
  remaining: number
  started: boolean
  onStart: () => void
}

export function SyncTimer({ remaining, started, onStart }: Props) {
  const displayedSeconds = started ? remaining : SYNC_DURATION_MS / 1000
  const expired = started && remaining === 0
  const urgent = started && remaining <= 30
  const status = !started
    ? 'Activate console sync, then start the timer.'
    : expired
      ? 'Stop guessing. Reactivate console sync, restart the timer, then retry this code.'
      : urgent
        ? '30 seconds or less left.'
        : 'Sync timer running'

  return (
    <div className={`sync-timer${urgent ? ' sync-timer-urgent' : ''}`}>
      <h2>Sync timer</h2>
      <p className="sync-countdown" role="timer" aria-label="Console sync time remaining" aria-live="off">
        {Math.floor(displayedSeconds / 60)}:{String(displayedSeconds % 60).padStart(2, '0')}
      </p>
      <p id="sync-timer-status" role="status">{status}</p>
      <button onClick={onStart}>
        {started ? 'Restart 2:30 timer' : 'Start 2:30 timer'}
      </button>
    </div>
  )
}
