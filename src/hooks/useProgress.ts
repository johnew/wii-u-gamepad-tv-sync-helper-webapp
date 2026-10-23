import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { EMPTY_PROGRESS, progressReducer, sanitizeProgress, type Progress } from '../lib/progress'

const STORAGE_KEY = 'wiiu-sync-helper-progress-v1'

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? sanitizeProgress(JSON.parse(raw)) : EMPTY_PROGRESS
  } catch {
    return EMPTY_PROGRESS
  }
}

/** Progress state persisted to localStorage. */
export function useProgress() {
  const [progress, dispatch] = useReducer(progressReducer, undefined, loadProgress)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const triedSet = useMemo(() => new Set(progress.tried), [progress.tried])

  const actions = useMemo(
    () => ({
      goTo: (index: number) => dispatch({ type: 'goTo', index }),
      next: () => dispatch({ type: 'next' }),
      back: () => dispatch({ type: 'back' }),
      toggleTried: (index: number) => dispatch({ type: 'toggleTried', index }),
      markFound: () => dispatch({ type: 'markFound' }),
      clearFound: () => dispatch({ type: 'clearFound' }),
      reset: () => dispatch({ type: 'reset' }),
      replace: (next: Progress) => dispatch({ type: 'replace', progress: next }),
    }),
    [],
  )

  const confirmReset = useCallback(() => {
    if (window.confirm('Reset all progress? This clears every tried code.')) actions.reset()
  }, [actions])

  return { progress, triedSet, actions, confirmReset }
}
