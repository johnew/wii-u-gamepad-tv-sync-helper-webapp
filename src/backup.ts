import { ALL_CODES, codeToString } from './codes'

export interface Progress {
  current: number
  tried: number[]
  found: number | null
}

export const EMPTY_PROGRESS: Progress = { current: 0, tried: [], found: null }

export const BACKUP_APP_ID = 'wiiu-sync-helper'
export const BACKUP_VERSION = 1

export interface BackupFile {
  app: typeof BACKUP_APP_ID
  version: number
  exportedAt: string
  progress: Progress
  /** Human-readable copies; ignored on import. */
  readable: {
    current: string
    found: string | null
    tried: string[]
  }
}

function isIndex(n: unknown, total: number): n is number {
  return typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < total
}

/** Leniently sanitizes stored data; invalid fields fall back to defaults. */
export function sanitizeProgress(data: unknown, total: number = ALL_CODES.length): Progress {
  if (!data || typeof data !== 'object') return EMPTY_PROGRESS
  const p = data as Partial<Record<keyof Progress, unknown>>
  return {
    current: isIndex(p.current, total) ? p.current : 0,
    tried: Array.isArray(p.tried)
      ? [...new Set(p.tried.filter((n): n is number => isIndex(n, total)))]
      : [],
    found: isIndex(p.found, total) ? p.found : null,
  }
}

export function createBackup(progress: Progress, now: Date = new Date()): BackupFile {
  const toStr = (i: number) => codeToString(ALL_CODES[i])
  return {
    app: BACKUP_APP_ID,
    version: BACKUP_VERSION,
    exportedAt: now.toISOString(),
    progress,
    readable: {
      current: toStr(progress.current),
      found: progress.found === null ? null : toStr(progress.found),
      tried: [...progress.tried].sort((a, b) => a - b).map(toStr),
    },
  }
}

export function backupFileName(now: Date = new Date()): string {
  return `wiiu-sync-progress-${now.toISOString().slice(0, 10)}.json`
}

/**
 * Strictly parses an imported backup. Accepts either a full backup file or a bare progress object.
 * Throws an Error with a user-friendly message if the data is invalid.
 */
export function parseBackup(text: string, total: number = ALL_CODES.length): Progress {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('The file is not valid JSON.')
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('The backup has an unexpected format.')
  }

  const obj = data as Record<string, unknown>
  if ('app' in obj && obj.app !== BACKUP_APP_ID) {
    throw new Error('This file is not a Wii U Sync Helper backup.')
  }
  if (typeof obj.version === 'number' && obj.version > BACKUP_VERSION) {
    throw new Error('This backup was made by a newer version of the app.')
  }

  const raw = (obj.progress ?? obj) as Record<string, unknown>
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.tried)) {
    throw new Error('The backup does not contain a list of tried codes.')
  }
  if (raw.tried.some((n) => !isIndex(n, total))) {
    throw new Error(`The backup contains invalid code numbers (expected 0–${total - 1}).`)
  }
  if (raw.current !== undefined && !isIndex(raw.current, total)) {
    throw new Error('The backup has an invalid current code.')
  }
  if (raw.found !== undefined && raw.found !== null && !isIndex(raw.found, total)) {
    throw new Error('The backup has an invalid found code.')
  }

  return sanitizeProgress(raw, total)
}
