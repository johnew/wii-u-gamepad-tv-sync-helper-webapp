export function SyncInstructions() {
  return (
    <details className="card instructions">
      <summary>How to sync without a working TV</summary>
      <ol>
        <li>Turn on the Wii U console and the GamePad.</li>
        <li>
          Press the red <strong>SYNC</strong> button on the front of the console (behind the SD card
          flap). The TV would normally show the sync code now.
        </li>
        <li>
          Press the <strong>SYNC</strong> button on the back of the GamePad (next to the sensor bar
          port). The GamePad shows the ♠ ♥ ♦ ♣ keypad.
        </li>
        <li>Enter the code shown above on the GamePad.</li>
        <li>
          If it fails, click <em>Didn't work → Next</em>, re-start the sync if needed, and enter the
          next code.
        </li>
        <li>When the GamePad connects, click <em>It worked!</em> to save the code.</li>
      </ol>
      <p className="muted">
        Note: if the console picks a new code for every sync attempt, just keep going forward
        through the list. Every guess still has the same chance of being right.
      </p>
    </details>
  )
}
