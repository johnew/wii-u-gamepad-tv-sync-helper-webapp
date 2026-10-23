import type { ReactNode } from 'react'

interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
  children: ReactNode
}

export function Checkbox({ checked, onChange, className, children }: Props) {
  return (
    <label className={className}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />{' '}
      {children}
    </label>
  )
}
