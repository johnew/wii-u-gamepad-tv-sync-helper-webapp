/** Joins truthy class names, e.g. `cx('cell', isActive && 'active')`. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
