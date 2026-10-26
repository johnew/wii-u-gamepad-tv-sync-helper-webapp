import { describe, expect, it } from 'vitest'
import { remainingSyncSeconds, SYNC_DURATION_MS } from './syncTimer'

describe('sync timer', () => {
  it('blocks advancing before a session has started', () => {
    expect(remainingSyncSeconds(null, 1000)).toBe(0)
  })

  it('starts at two minutes thirty seconds, leaving a thirty-second buffer', () => {
    expect(SYNC_DURATION_MS).toBe(150_000)
    expect(remainingSyncSeconds(1000 + SYNC_DURATION_MS, 1000)).toBe(150)
  })

  it('rounds up while any time remains and expires at the exact deadline', () => {
    expect(remainingSyncSeconds(150_000, 149_000)).toBe(1)
    expect(remainingSyncSeconds(150_000, 149_999)).toBe(1)
    expect(remainingSyncSeconds(150_000, 150_000)).toBe(0)
  })

  it('uses elapsed wall time even after a long background pause', () => {
    expect(remainingSyncSeconds(150_000, 90_500)).toBe(60)
    expect(remainingSyncSeconds(150_000, 600_000)).toBe(0)
  })
})
