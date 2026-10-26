export function SyncInstructions() {
  return (
    <details className="card instructions" open>
      <summary>How to use</summary>
      <p>
        <strong>Console sync lasts 3 minutes.</strong> Our 2:30 timer leaves a 30-second buffer.
      </p>
      <ol>
        <li>
          <strong>Start sync:</strong> turn on both devices, activate console SYNC, then immediately
          tap <em>Start 2:30 timer</em>.
        </li>
        <li>
          <strong>Try codes:</strong> press SYNC on the back of the GamePad and enter the code
          shown in this app. Failed? Tap <em>Next</em>. Connected? Tap <em>It worked!</em>
        </li>
        <li>
          <strong>Timer finished?</strong> Reactivate console sync (and GamePad sync if needed),
          tap <em>Restart 2:30 timer</em>, and retry the current code.
        </li>
      </ol>
      <ul className="muted">
        <li>Next locks before starting and when time is up. Your progress stays saved.</li>
        <li>Switching apps keeps the timer running. Reloading requires a fresh sync session.</li>
        <li>The app cannot detect console sync. A new sync code means past guesses may not rule it out.</li>
      </ul>
    </details>
  )
}
