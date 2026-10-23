import { clampCodeIndex, isCodeIndex } from './codes'

export interface Progress {
  current: number
  tried: number[]
  found: number | null
}

export const EMPTY_PROGRESS: Progress = { current: 0, tried: [], found: null }

export type ProgressAction =
  | { type: 'goTo'; index: number }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'toggleTried'; index: number }
  | { type: 'markFound' }
  | { type: 'clearFound' }
  | { type: 'reset' }
  | { type: 'replace'; progress: Progress }

function withTried(tried: number[], index: number): number[] {
  return tried.includes(index) ? tried : [...tried, index]
}

export function progressReducer(state: Progress, action: ProgressAction): Progress {
  switch (action.type) {
    case 'goTo':
      return { ...state, current: clampCodeIndex(action.index) }
    case 'next':
      return {
        ...state,
        tried: withTried(state.tried, state.current),
        current: clampCodeIndex(state.current + 1),
      }
    case 'back':
      return { ...state, current: clampCodeIndex(state.current - 1) }
    case 'toggleTried':
      return {
        ...state,
        tried: state.tried.includes(action.index)
          ? state.tried.filter((i) => i !== action.index)
          : [...state.tried, action.index],
      }
    case 'markFound':
      return { ...state, found: state.current }
    case 'clearFound':
      return { ...state, found: null }
    case 'reset':
      return EMPTY_PROGRESS
    case 'replace':
      return action.progress
  }
}

/** Leniently cleans untrusted data; invalid fields fall back to defaults. */
export function sanitizeProgress(data: unknown): Progress {
  if (!data || typeof data !== 'object') return EMPTY_PROGRESS
  const p = data as Partial<Record<keyof Progress, unknown>>
  return {
    current: isCodeIndex(p.current) ? p.current : 0,
    tried: Array.isArray(p.tried) ? [...new Set(p.tried.filter(isCodeIndex))] : [],
    found: isCodeIndex(p.found) ? p.found : null,
  }
}
