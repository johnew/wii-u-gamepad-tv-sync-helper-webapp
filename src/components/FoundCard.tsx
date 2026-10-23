import { ALL_CODES, CODE_COUNT } from '../lib/codes'
import { CodeSymbols } from './CodeSymbols'

interface Props {
  found: number
  onKeepGuessing: () => void
  onStartOver: () => void
}

export function FoundCard({ found, onKeepGuessing, onStartOver }: Props) {
  return (
    <section className="card success" aria-live="polite">
      <h2>🎉 Synced!</h2>
      <p>Your code was:</p>
      <CodeSymbols code={ALL_CODES[found]} size="lg" />
      <p className="muted">
        Code #{found + 1} of {CODE_COUNT}
      </p>
      <div className="actions">
        <button onClick={onKeepGuessing}>Keep guessing</button>
        <button className="danger" onClick={onStartOver}>
          Start over
        </button>
      </div>
    </section>
  )
}
