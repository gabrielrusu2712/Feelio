import rocketUrl from '@/game/data-access/assets/images/rocket.png'
import obstacle1Url from '@/game/data-access/assets/images/obstacle-1.png'
import obstacle2Url from '@/game/data-access/assets/images/obstacle-2.png'
import starUrl from '@/game/data-access/assets/images/star.png'
import spaceBgUrl from '@/game/data-access/assets/images/space-bg.jpg'
import hitSoundUrl from '@/game/data-access/assets/sounds/hit.mp3'
import starSoundUrl from '@/game/data-access/assets/sounds/star.mp3'
import overSoundUrl from '@/game/data-access/assets/sounds/over.mp3'
import {
  ROCKET_DRAW_HEIGHT_DEFAULT,
  ROCKET_DRAW_WIDTH,
} from '@/game/data-access/constants/game.constants'

const loadImage = (src: string): HTMLImageElement => {
  const image = new Image()
  image.src = src
  return image
}

// Module-level singletons: instantiated once regardless of how many times the
// game page mounts/unmounts across a session.
export const rocketImage = loadImage(rocketUrl)
export const obstacle1Image = loadImage(obstacle1Url)
export const obstacle2Image = loadImage(obstacle2Url)
export const starImage = loadImage(starUrl)
export const spaceBgImage = loadImage(spaceBgUrl)

// The rocket's draw height is derived from its natural aspect ratio once the
// image loads (mirrors the source), read fresh every frame by the draw loop.
export const rocketDrawSize = { width: ROCKET_DRAW_WIDTH, height: ROCKET_DRAW_HEIGHT_DEFAULT }
rocketImage.onload = () => {
  const ratio = rocketImage.naturalWidth / rocketImage.naturalHeight
  if (Number.isFinite(ratio) && ratio > 0) {
    rocketDrawSize.height = Math.round(rocketDrawSize.width / ratio)
  }
}

const loadSound = (src: string, volume: number): HTMLAudioElement => {
  const audio = new Audio(src)
  audio.volume = volume
  return audio
}

export const hitSound = loadSound(hitSoundUrl, 0.5)
export const starSound = loadSound(starSoundUrl, 0.5)
export const overSound = loadSound(overSoundUrl, 0.6)

export const playSound = (audio: HTMLAudioElement): void => {
  audio.currentTime = 0
  void audio.play().catch(() => {
    // Autoplay can be blocked (no prior user gesture) — silent no-op, mirrors source.
  })
}
