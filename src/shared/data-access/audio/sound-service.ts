import clickSoundUrl from '@/shared/data-access/assets/sounds/click.mp3'

// Debounced so rapid clicks (double-taps, key-repeat) don't stack playback.
const CLICK_DEBOUNCE_MS = 250

const clickAudio = new Audio(clickSoundUrl)
clickAudio.volume = 1.0

let lastPlayedAt = 0

export const playClickSound = (): void => {
  const now = Date.now()
  if (now - lastPlayedAt < CLICK_DEBOUNCE_MS) return
  lastPlayedAt = now

  clickAudio.currentTime = 0
  void clickAudio.play().catch(() => {
    // Autoplay can be blocked (no prior user gesture) — silent no-op.
  })
}
