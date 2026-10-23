import { describe, expect, it } from 'vitest'
import { ALL_CODES, codeToString, generateCodes } from './codes'

describe('generateCodes', () => {
  it('produces all 256 four-symbol codes', () => {
    expect(ALL_CODES).toHaveLength(256)
    expect(ALL_CODES.every((c) => c.length === 4)).toBe(true)
  })

  it('produces only unique codes', () => {
    const unique = new Set(ALL_CODES.map(codeToString))
    expect(unique.size).toBe(256)
  })

  it('is ordered lexicographically by keypad order', () => {
    expect(codeToString(ALL_CODES[0])).toBe('♠ ♠ ♠ ♠')
    expect(codeToString(ALL_CODES[1])).toBe('♠ ♠ ♠ ♥')
    expect(codeToString(ALL_CODES[4])).toBe('♠ ♠ ♥ ♠')
    expect(codeToString(ALL_CODES[255])).toBe('♣ ♣ ♣ ♣')
  })

  it('supports other lengths', () => {
    expect(generateCodes(1)).toHaveLength(4)
    expect(generateCodes(2)).toHaveLength(16)
  })
})
