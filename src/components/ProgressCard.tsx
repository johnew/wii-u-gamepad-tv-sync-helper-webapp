import { CODE_COUNT } from '../lib/codes'

interface Props {
  triedCount: number
  onReset: () => void
}

export function ProgressCard({ triedCount, onReset }: Props) {
  const percent = Math.round((triedCount / CODE_COUNT) * 100)

  return (
    <section className="card">
      <div className="progress-header">
        <span>
          Tried <strong>{triedCount}</strong> of {CODE_COUNT} ({percent}%)
        </span>
        <button className="danger small" onClick={onReset}>
          Reset progress
        </button>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={CODE_COUNT}
        aria-valuenow={triedCount}
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </section>
  )
}
