import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { BACKUP_MIME_TYPE, backupFileName, parseBackup, serializeBackup } from '../lib/backup'
import { downloadFile } from '../lib/browser'
import { cx } from '../lib/cx'
import type { Progress } from '../lib/progress'

interface Props {
  open: boolean
  onClose: () => void
  progress: Progress
  onImport: (progress: Progress) => void
}

type Status = { kind: 'ok' | 'error'; text: string } | null

export function SettingsDialog({ open, onClose, progress, onImport }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [pasted, setPasted] = useState('')
  const [status, setStatus] = useState<Status>(null)

  const succeed = (text: string) => setStatus({ kind: 'ok', text })
  const fail = (text: string) => setStatus({ kind: 'error', text })

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setStatus(null)
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Not every browser closes a modal <dialog> on Escape, so handle it explicitly
  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  function handleDownload() {
    downloadFile(backupFileName(), serializeBackup(progress), BACKUP_MIME_TYPE)
    succeed('Backup downloaded.')
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(serializeBackup(progress))
      succeed('Backup copied to clipboard.')
    } catch {
      fail('Could not access the clipboard. Use Download instead.')
    }
  }

  function importText(text: string) {
    let next: Progress
    try {
      next = parseBackup(text)
    } catch (e) {
      fail((e as Error).message)
      return
    }
    const message =
      `Replace your current progress (${progress.tried.length} tried) ` +
      `with the backup (${next.tried.length} tried)?`
    if (!window.confirm(message)) return
    onImport(next)
    setPasted('')
    succeed(`Imported ${next.tried.length} tried codes.`)
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    // Clear so selecting the same file again still fires onChange
    e.target.value = ''
    if (file) importText(await file.text())
  }

  return (
    <dialog
      ref={dialogRef}
      className="settings-dialog"
      onClose={onClose}
      onClick={(e) => {
        // Close when tapping the backdrop
        if (e.target === dialogRef.current) onClose()
      }}
      aria-labelledby="settings-title"
    >
      <div className="settings-content">
        <div className="settings-header">
          <h2 id="settings-title">Settings</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close settings">
            ✕
          </button>
        </div>

        <section>
          <h3>Export progress</h3>
          <p className="muted">
            Save a backup of the codes you've tried ({progress.tried.length}) as a JSON file.
          </p>
          <div className="actions actions-start">
            <button className="primary" onClick={handleDownload}>
              Download backup
            </button>
            <button onClick={handleCopy}>Copy to clipboard</button>
          </div>
        </section>

        <section>
          <h3>Import progress</h3>
          <p className="muted">Restore from a backup. This replaces your current progress.</p>
          <div className="actions actions-start">
            <button onClick={() => fileRef.current?.click()}>Import from file…</button>
            <input
              ref={fileRef}
              type="file"
              accept={`.json,${BACKUP_MIME_TYPE}`}
              onChange={handleFile}
              hidden
            />
          </div>
          <label className="paste-label" htmlFor="paste-backup">
            …or paste backup JSON:
          </label>
          <textarea
            id="paste-backup"
            rows={4}
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            placeholder='{"app": "wiiu-sync-helper", ...}'
            spellCheck={false}
          />
          <div className="actions actions-start">
            <button onClick={() => importText(pasted)} disabled={!pasted.trim()}>
              Import pasted JSON
            </button>
          </div>
        </section>

        {status && (
          <p className={cx('settings-status', status.kind)} role="status">
            {status.text}
          </p>
        )}
      </div>
    </dialog>
  )
}
