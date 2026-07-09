import waterSoundUrl from '@/shared/data-access/assets/sounds/water.mp3'
import foodSoundUrl from '@/shared/data-access/assets/sounds/food.mp3'
import sleepSoundUrl from '@/shared/data-access/assets/sounds/sleep.mp3'
import sportSoundUrl from '@/shared/data-access/assets/sounds/sport.mp3'
import type { CharacterAction } from '@/shared/data-access/constants/character'

// The source clips run much longer than this — matches the character's
// on-screen action duration (see ACTION_RESET_MS), so playback is cut short here.
const SOUND_DURATION_MS = 3000

const loadSound = (src: string): HTMLAudioElement => {
  const audio = new Audio(src)
  audio.volume = 1.0
  return audio
}

// Only the stat-bump actions have a matching sound (mirrors STAT_ACTIONS) —
// petting the bear stays silent.
const ACTION_SOUNDS: Partial<Record<CharacterAction, HTMLAudioElement>> = {
  water: loadSound(waterSoundUrl),
  food: loadSound(foodSoundUrl),
  sleep: loadSound(sleepSoundUrl),
  sport: loadSound(sportSoundUrl),
}

// One pending stop timer per audio element, so a re-trigger before the 3s
// mark restarts the window instead of an earlier timer cutting it off early.
const stopTimers = new WeakMap<HTMLAudioElement, ReturnType<typeof setTimeout>>()

export const playCharacterActionSound = (action: CharacterAction): void => {
  const audio = ACTION_SOUNDS[action]
  if (!audio) return

  const pendingStop = stopTimers.get(audio)
  if (pendingStop) clearTimeout(pendingStop)

  audio.currentTime = 0
  void audio.play().catch(() => {
    // Autoplay can be blocked (no prior user gesture) — silent no-op.
  })

  stopTimers.set(
    audio,
    setTimeout(() => {
      audio.pause()
      audio.currentTime = 0
    }, SOUND_DURATION_MS),
  )
}
