import { useCallback, useMemo, useRef, useState } from 'react'
import { CODE_COUNT } from './lib/codes'
import { haptic } from './lib/browser'
import { useProgress } from './hooks/useProgress'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { CodeGrid } from './components/CodeGrid'
import { FoundCard } from './components/FoundCard'
import { GuidedCard } from './components/GuidedCard'
import { ProgressCard } from './components/ProgressCard'
import { SettingsDialog } from './components/SettingsDialog'
import { SyncInstructions } from './components/SyncInstructions'
import './App.css'

function App() {
  const { progress, triedSet, actions, confirmReset } = useProgress()
  const { current, found } = progress
  const [settingsOpen, setSettingsOpen] = useState(false)
  const closeSettings = useCallback(() => setSettingsOpen(false), [])
  const guidedRef = useRef<HTMLElement>(null)

  const next = useCallback(() => {
    haptic()
    actions.next()
  }, [actions])

  const shortcuts = useMemo(
    () => ({ ' ': next, Enter: next, ArrowRight: next, ArrowLeft: actions.back, Backspace: actions.back }),
    [next, actions],
  )

  useKeyboardShortcuts(shortcuts, found === null && !settingsOpen)

  function selectCode(index: number) {
    actions.goTo(index)
    guidedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1>Wii U GamePad Sync Helper</h1>
          <p className="subtitle">
            Can't see the sync code on your TV? Try all {CODE_COUNT} combinations, one by one.
          </p>
        </div>
        <button
          className="icon-btn settings-btn"
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
          title="Settings (backup / restore)"
        >
          ⚙
        </button>
      </header>

      <SettingsDialog
        open={settingsOpen}
        onClose={closeSettings}
        progress={progress}
        onImport={actions.replace}
      />

      {found !== null ? (
        <FoundCard found={found} onKeepGuessing={actions.clearFound} onStartOver={confirmReset} />
      ) : (
        <GuidedCard
          ref={guidedRef}
          current={current}
          isTried={triedSet.has(current)}
          onBack={actions.back}
          onNext={next}
          onFound={actions.markFound}
        />
      )}

      <ProgressCard triedCount={triedSet.size} onReset={confirmReset} />

      <SyncInstructions />

      <CodeGrid
        current={current}
        found={found}
        triedSet={triedSet}
        onSelect={selectCode}
        onToggleTried={actions.toggleTried}
      />

      <footer className="muted">Progress is saved in your browser. Use ⚙ Settings to back it up.</footer>
    </main>
  )
}

export default App
