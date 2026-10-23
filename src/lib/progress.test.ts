import { describe, expect, it } from 'vitest'
import { CODE_COUNT } from './codes'
import { EMPTY_PROGRESS, progressReducer, sanitizeProgress, type Progress } from './progress'

const at = (current: number, tried: number[] = [], found: number | null = null): Progress => ({
  current,
  tried,
  found,
})

describe('progressReducer', () => {
  it('next marks the current code as tried and advances', () => {
    expect(progressReducer(at(0), { type: 'next' })).toEqual(at(1, [0]))
  })

  it('next does not duplicate tried codes or move past the last code', () => {
    const last = CODE_COUNT - 1
    expect(progressReducer(at(last, [last]), { type: 'next' })).toEqual(at(last, [last]))
  })

  it('back moves to the previous code but not below zero', () => {
    expect(progressReducer(at(5), { type: 'back' })).toEqual(at(4))
    expect(progressReducer(at(0), { type: 'back' })).toEqual(at(0))
  })

  it('goTo clamps to the valid range', () => {
    expect(progressReducer(at(0), { type: 'goTo', index: 10 }).current).toBe(10)
    expect(progressReducer(at(0), { type: 'goTo', index: 999 }).current).toBe(CODE_COUNT - 1)
    expect(progressReducer(at(5), { type: 'goTo', index: -3 }).current).toBe(0)
  })

  it('toggleTried adds and removes a code', () => {
    const added = progressReducer(at(0), { type: 'toggleTried', index: 7 })
    expect(added.tried).toEqual([7])
    expect(progressReducer(added, { type: 'toggleTried', index: 7 }).tried).toEqual([])
  })

  it('markFound / clearFound track the winning code', () => {
    const found = progressReducer(at(12), { type: 'markFound' })
    expect(found.found).toBe(12)
    expect(progressReducer(found, { type: 'clearFound' }).found).toBeNull()
  })

  it('reset and replace swap the whole state', () => {
    expect(progressReducer(at(9, [1, 2], 9), { type: 'reset' })).toEqual(EMPTY_PROGRESS)
    expect(progressReducer(at(0), { type: 'replace', progress: at(3, [1]) })).toEqual(at(3, [1]))
  })
})

describe('sanitizeProgress', () => {
  it('falls back to defaults for garbage', () => {
    expect(sanitizeProgress(null)).toEqual(EMPTY_PROGRESS)
    expect(sanitizeProgress({ current: 'x', tried: [1, 'a', 999, 1], found: 1.5 })).toEqual(at(0, [1]))
  })
})
