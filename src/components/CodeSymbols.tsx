import { codeToNames, type Code } from '../lib/codes'

interface Props {
  code: Code
  size: 'lg' | 'sm'
}

export function CodeSymbols({ code, size }: Props) {
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
