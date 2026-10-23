import { useState, type Ref } from 'react'
import { ALL_CODES, CODE_COUNT, codeToNames } from '../lib/codes'
import { useWakeLock } from '../hooks/useWakeLock'
import { CodeSymbols } from './CodeSymbols'
import { Checkbox } from './Checkbox'

interface Props {
  current: number
  isTried: boolean
  onBack: () => void
  onNext: () => void
  onFound: () => void
  ref?: Ref<HTMLElement>
}

export function GuidedCard({ current, isTried, onBack, onNext, onFound, ref }: Props) {
  const [keepAwake, setKeepAwake] = useState(true)
  const wakeLock = useWakeLock(keepAwake)
  const code = ALL_CODES[current]

  return (
    <section className="card guided" aria-live="polite" ref={ref}>
      <p className="counter">
        Code <strong>{current + 1}</strong> / {CODE_COUNT}
        {isTried && <span className="badge">already tried</span>}
      </p>
      <CodeSymbols code={code} size="lg" />
      <p className="muted names">{codeToNames(code)}</p>
      <div className="actions guided-actions">
        <button className="back-btn" onClick={onBack} disabled={current === 0}>
          ← Back
        </button>
        <button className="primary next-btn" onClick={onNext}>
          Didn't work → Next
        </button>
        <button className="success-btn found-btn" onClick={onFound}>
          It worked! 🎉
        </button>
      </div>
      <p className="hint keyboard-hint">
        Keyboard: <kbd>Space</kbd>/<kbd>Enter</kbd>/<kbd>→</kbd> next, <kbd>←</kbd> back
      </p>
      {wakeLock.supported && (
        <Checkbox className="hint wake-toggle" checked={keepAwake} onChange={setKeepAwake}>
          Keep screen on{keepAwake && wakeLock.active ? ' (active)' : ''}
        </Checkbox>
      )}
    </section>
  )
}
