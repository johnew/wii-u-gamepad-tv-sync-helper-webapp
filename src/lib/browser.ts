const HAPTIC_DURATION_MS = 15

/** Short vibration on supporting devices (mostly Android); no-op elsewhere. */
export function haptic(): void {
  if ('vibrate' in navigator) navigator.vibrate(HAPTIC_DURATION_MS)
}

export function downloadFile(fileName: string, contents: string, mimeType: string): void {
  const url = URL.createObjectURL(new Blob([contents], { type: mimeType }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  // Give the browser a moment to start the download before freeing the URL
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
