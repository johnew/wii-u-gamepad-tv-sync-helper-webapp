import { useEffect } from 'react'

const INTERACTIVE_TAGS = new Set(['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'])

/**
 * Maps `KeyboardEvent.key` values to handlers on the window.
 * Ignored while disabled or while an interactive element has focus, so native behaviour wins.
 * Auto-repeat from a held key is swallowed so one press triggers one action.
 */
export function useKeyboardShortcuts(bindings: Record<string, () => void>, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      if (target && INTERACTIVE_TAGS.has(target.tagName)) return
      const handler = bindings[e.key]
      if (!handler) return
      e.preventDefault()
      if (!e.repeat) handler()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [bindings, enabled])
}
