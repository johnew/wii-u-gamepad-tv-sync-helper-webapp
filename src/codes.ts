export type Suit = 'spade' | 'heart' | 'diamond' | 'club'

export interface SuitInfo {
  id: Suit
  symbol: string
  name: string
  color: 'black' | 'red'
}

// Order matches the GamePad's sync keypad: ♠ ♥ ♦ ♣
export const SUITS: readonly SuitInfo[] = [
  { id: 'spade', symbol: '♠', name: 'Spade', color: 'black' },
  { id: 'heart', symbol: '♥', name: 'Heart', color: 'red' },
  { id: 'diamond', symbol: '♦', name: 'Diamond', color: 'red' },
  { id: 'club', symbol: '♣', name: 'Club', color: 'black' },
]

export const CODE_LENGTH = 4

export type Code = readonly SuitInfo[]

/** Every possible sync code (4^4 = 256) in lexicographic order. */
export function generateCodes(length: number = CODE_LENGTH): Code[] {
  if (length <= 0) return [[]]
  const shorter = generateCodes(length - 1)
  return shorter.flatMap((prefix) => SUITS.map((suit) => [...prefix, suit]))
}

export const ALL_CODES: readonly Code[] = generateCodes()

export function codeToString(code: Code): string {
  return code.map((s) => s.symbol).join(' ')
}

export function codeToNames(code: Code): string {
  return code.map((s) => s.name).join(', ')
}
