export const SYNC_DURATION_MS = (2 * 60 + 30) * 1000

export function remainingSyncSeconds(deadline: number | null, now: number): number {
  return deadline === null ? 0 : Math.max(0, Math.ceil((deadline - now) / 1000))
}
