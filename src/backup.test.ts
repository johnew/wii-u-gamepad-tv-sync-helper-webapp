import { describe, expect, it } from 'vitest'
import { backupFileName, createBackup, parseBackup, sanitizeProgress } from './backup'

describe('createBackup / parseBackup', () => {
  it('round-trips progress', () => {
    const progress = { current: 42, tried: [0, 1, 2, 41], found: null }
    const backup = createBackup(progress, new Date('2026-10-23T10:00:00Z'))
    expect(backup.app).toBe('wiiu-sync-helper')
    expect(backup.readable.tried[0]).toBe('♠ ♠ ♠ ♠')
    expect(parseBackup(JSON.stringify(backup))).toEqual(progress)
  })

  it('accepts a bare progress object', () => {
    expect(parseBackup('{"current":3,"tried":[1,2],"found":5}')).toEqual({
      current: 3,
      tried: [1, 2],
      found: 5,
    })
  })

  it('removes duplicate tried entries', () => {
    expect(parseBackup('{"tried":[1,1,2]}').tried).toEqual([1, 2])
  })

  it('rejects invalid JSON', () => {
    expect(() => parseBackup('not json')).toThrow(/valid JSON/)
  })

  it('rejects files from other apps', () => {
    expect(() => parseBackup('{"app":"other","progress":{"tried":[]}}')).toThrow(/not a Wii U/)
  })

  it('rejects out-of-range codes', () => {
    expect(() => parseBackup('{"tried":[0,256]}')).toThrow(/invalid code numbers/)
    expect(() => parseBackup('{"tried":[],"current":-1}')).toThrow(/current/)
  })

  it('rejects data without a tried list', () => {
    expect(() => parseBackup('{"current":1}')).toThrow(/tried codes/)
    expect(() => parseBackup('[]')).toThrow(/unexpected format/)
  })

  it('builds a dated file name', () => {
    expect(backupFileName(new Date('2026-10-23T10:00:00Z'))).toBe('wiiu-sync-progress-2026-10-23.json')
  })
})

describe('sanitizeProgress', () => {
  it('falls back to defaults for garbage', () => {
    expect(sanitizeProgress(null)).toEqual({ current: 0, tried: [], found: null })
    expect(sanitizeProgress({ current: 'x', tried: [1, 'a', 999], found: 1.5 })).toEqual({
      current: 0,
      tried: [1],
      found: null,
    })
  })
})
