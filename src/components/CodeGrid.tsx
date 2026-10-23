import { useState } from 'react'
import { ALL_CODES, codeToString } from '../lib/codes'
import { cx } from '../lib/cx'
import { CodeSymbols } from './CodeSymbols'
import { Checkbox } from './Checkbox'

interface Props {
  current: number
  found: number | null
  triedSet: ReadonlySet<number>
  onSelect: (index: number) => void
  onToggleTried: (index: number) => void
}

export function CodeGrid({ current, found, triedSet, onSelect, onToggleTried }: Props) {
  const [hideTried, setHideTried] = useState(true)

  return (
    <section className="card">
      <div className="list-header">
        <h2>All combinations</h2>
        <Checkbox checked={hideTried} onChange={setHideTried}>
          Hide tried
        </Checkbox>
      </div>
      <p className="muted">Click a code to jump to it. Use the checkbox to mark it tried or untried.</p>
      <ul className="grid">
        {ALL_CODES.map((code, i) => {
          const tried = triedSet.has(i)
          const isCurrent = i === current
          if (hideTried && tried && !isCurrent) return null
          return (
            <li key={i} className={cx('cell', tried && 'tried', isCurrent && 'current', i === found && 'found')}>
              <button className="cell-jump" onClick={() => onSelect(i)} title={`Go to ${codeToString(code)}`}>
                <span className="cell-num">{i + 1}</span>
                <CodeSymbols code={code} size="sm" />
              </button>
              <label className="cell-check">
                <input
                  type="checkbox"
                  checked={tried}
                  onChange={() => onToggleTried(i)}
                  aria-label={`Mark code ${i + 1} as tried`}
                />
              </label>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
