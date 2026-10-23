import { ALL_CODES, CODE_COUNT, codeToString, isCodeIndex } from './codes'
import { sanitizeProgress, type Progress } from './progress'

export const BACKUP_APP_ID = 'wiiu-sync-helper'
export const BACKUP_VERSION = 1
export const BACKUP_MIME_TYPE = 'application/json'

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

const indexToString = (index: number) => codeToString(ALL_CODES[index])

export function createBackup(progress: Progress, now: Date = new Date()): BackupFile {
  return {
    app: BACKUP_APP_ID,
    version: BACKUP_VERSION,
    exportedAt: now.toISOString(),
    progress,
    readable: {
      current: indexToString(progress.current),
      found: progress.found === null ? null : indexToString(progress.found),
      tried: [...progress.tried].sort((a, b) => a - b).map(indexToString),
    },
  }
}

export function serializeBackup(progress: Progress): string {
  return JSON.stringify(createBackup(progress), null, 2)
}

export function backupFileName(now: Date = new Date()): string {
  return `wiiu-sync-progress-${now.toISOString().slice(0, 10)}.json`
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Strictly parses an imported backup. Accepts a full backup file or a bare progress object.
 * Throws an Error with a user-friendly message if the data is invalid.
 */
export function parseBackup(text: string): Progress {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('The file is not valid JSON.')
  }
  if (!isPlainObject(data)) throw new Error('The backup has an unexpected format.')
  if ('app' in data && data.app !== BACKUP_APP_ID) {
    throw new Error('This file is not a Wii U Sync Helper backup.')
  }
  if (typeof data.version === 'number' && data.version > BACKUP_VERSION) {
    throw new Error('This backup was made by a newer version of the app.')
  }

  const raw = data.progress ?? data
  if (!isPlainObject(raw) || !Array.isArray(raw.tried)) {
    throw new Error('The backup does not contain a list of tried codes.')
  }
  if (!raw.tried.every(isCodeIndex)) {
    throw new Error(`The backup contains invalid code numbers (expected 0–${CODE_COUNT - 1}).`)
  }
  if (raw.current !== undefined && !isCodeIndex(raw.current)) {
    throw new Error('The backup has an invalid current code.')
  }
  if (raw.found != null && !isCodeIndex(raw.found)) {
    throw new Error('The backup has an invalid found code.')
  }

  return sanitizeProgress(raw)
}
