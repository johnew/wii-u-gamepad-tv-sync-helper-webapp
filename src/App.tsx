import { useCallback, useEffect, useRef, useState } from 'react'
import { ALL_CODES, codeToNames, codeToString, type Code } from './codes'
import { useProgress } from './useProgress'
import { useWakeLock } from './useWakeLock'
import './App.css'

const TOTAL = ALL_CODES.length

function haptic() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(15)
}

function CodeSymbols({ code, size }: { code: Code; size: 'lg' | 'sm' }) {
  return (
    <span className={`code code-${size}`} aria-label={codeToNames(code)}>
      {code.map((suit, i) => (
        <span key={i} className={`suit suit-${suit.color}`} aria-hidden="true">
          {suit.symbol}
        </span>
      ))}
    </span>
  )
}

function App() {
  const { progress, triedSet, goTo, markTriedAndNext, back, toggleTried, markFound, clearFound, reset } =
    useProgress(TOTAL)
  const [hideTried, setHideTried] = useState(false)
  const [keepAwake, setKeepAwake] = useState(true)
  const wakeLock = useWakeLock(keepAwake)
  const guidedRef = useRef<HTMLElement>(null)

  const next = useCallback(() => {
    haptic()
    markTriedAndNext()
  }, [markTriedAndNext])

  function jumpTo(index: number) {
    goTo(index)
    guidedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const { current, found } = progress
  const currentCode = ALL_CODES[current]
  const triedCount = triedSet.size
  const percent = Math.round((triedCount / TOTAL) * 100)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (found !== null) return
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'].includes(target.tagName)) return
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault()
        back()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [found, next, back])

  function handleReset() {
    if (window.confirm('Reset all progress? This clears every tried code.')) reset()
  }

  return (
    <main className="app">
      <header>
        <h1>Wii U GamePad Sync Helper</h1>
        <p className="subtitle">
          Can't see the sync code on your TV? Try all {TOTAL} combinations, one by one.
        </p>
      </header>

      {found !== null ? (
        <section className="card success" aria-live="polite">
          <h2>🎉 Synced!</h2>
          <p>Your code was:</p>
          <CodeSymbols code={ALL_CODES[found]} size="lg" />
          <p className="muted">
            Code #{found + 1} of {TOTAL}
          </p>
          <div className="actions">
            <button onClick={clearFound}>Keep guessing</button>
            <button className="danger" onClick={handleReset}>
              Start over
            </button>
          </div>
        </section>
      ) : (
        <section className="card guided" aria-live="polite" ref={guidedRef}>
          <p className="counter">
            Code <strong>{current + 1}</strong> / {TOTAL}
            {triedSet.has(current) && <span className="badge">already tried</span>}
          </p>
          <CodeSymbols code={currentCode} size="lg" />
          <p className="muted names">{codeToNames(currentCode)}</p>
          <div className="actions guided-actions">
            <button className="back-btn" onClick={back} disabled={current === 0}>
              ← Back
            </button>
            <button className="primary next-btn" onClick={next}>
              Didn't work → Next
            </button>
            <button className="success-btn found-btn" onClick={markFound}>
              It worked! 🎉
            </button>
          </div>
          <p className="hint keyboard-hint">
            Keyboard: <kbd>Space</kbd>/<kbd>Enter</kbd>/<kbd>→</kbd> next, <kbd>←</kbd> back
          </p>
          {wakeLock.supported && (
            <label className="hint wake-toggle">
              <input type="checkbox" checked={keepAwake} onChange={(e) => setKeepAwake(e.target.checked)} />{' '}
              Keep screen on{keepAwake && wakeLock.active ? ' (active)' : ''}
            </label>
          )}
        </section>
      )}

      <section className="card">
        <div className="progress-header">
          <span>
            Tried <strong>{triedCount}</strong> of {TOTAL} ({percent}%)
          </span>
          <button className="danger small" onClick={handleReset}>
            Reset progress
          </button>
        </div>
        <div
          className="progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={TOTAL}
          aria-valuenow={triedCount}
        >
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </section>

      <details className="card instructions">
        <summary>How to sync without a working TV</summary>
        <ol>
          <li>Turn on the Wii U console and the GamePad.</li>
          <li>
            Press the red <strong>SYNC</strong> button on the front of the console (behind the SD card
            flap). The TV would normally show the sync code now.
          </li>
          <li>
            Press the <strong>SYNC</strong> button on the back of the GamePad (next to the sensor bar
            port). The GamePad shows the ♠ ♥ ♦ ♣ keypad.
          </li>
          <li>Enter the code shown above on the GamePad.</li>
          <li>
            If it fails, click <em>Didn't work → Next</em>, re-start the sync if needed, and enter
            the next code.
          </li>
          <li>When the GamePad connects, click <em>It worked!</em> to save the code.</li>
        </ol>
        <p className="muted">
          Note: if the console picks a new code for every sync attempt, just keep going forward
          through the list. Every guess still has the same chance of being right.
        </p>
      </details>

      <section className="card">
        <div className="list-header">
          <h2>All combinations</h2>
          <label>
            <input type="checkbox" checked={hideTried} onChange={(e) => setHideTried(e.target.checked)} />{' '}
            Hide tried
          </label>
        </div>
        <p className="muted">Click a code to jump to it. Use the checkbox to mark it tried or untried.</p>
        <ul className="grid">
          {ALL_CODES.map((code, i) => {
            const tried = triedSet.has(i)
            if (hideTried && tried && i !== current) return null
            const classes = ['cell', tried ? 'tried' : '', i === current ? 'current' : '', i === found ? 'found' : '']
              .filter(Boolean)
              .join(' ')
            return (
              <li key={i} className={classes}>
                <button className="cell-jump" onClick={() => jumpTo(i)} title={`Go to ${codeToString(code)}`}>
                  <span className="cell-num">{i + 1}</span>
                  <CodeSymbols code={code} size="sm" />
                </button>
                <label className="cell-check">
                  <input
                    type="checkbox"
                    checked={tried}
                    onChange={() => toggleTried(i)}
                    aria-label={`Mark code ${i + 1} as tried`}
                  />
                </label>
              </li>
            )
          })}
        </ul>
      </section>

      <footer className="muted">Progress is saved in your browser.</footer>
    </main>
  )
}

export default App
