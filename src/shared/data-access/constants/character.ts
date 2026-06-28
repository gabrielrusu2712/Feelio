// Character (the Feelio bear) assets + presentation rules. iOS and Safari can't
// show transparent video (it renders black / no alpha-WebM), so idle moods are
// always static PNGs and action clips fall back to a static pose there.

import type { Stats } from '@/user/data-access/store'

export type CharacterMood = 'base' | 'happy' | 'sad'
export type CharacterAction = 'water' | 'food' | 'sleep' | 'sport' | 'pet'

// Which stat increment plays which animation; stats without an entry (vibe)
// don't drive the bear.
export const STAT_ACTIONS: Partial<Record<keyof Stats, CharacterAction>> = {
  water: 'water',
  food: 'food',
  sleep: 'sleep',
  sport: 'sport',
}

const BASE_PATH = '/assets/character'

export const MOOD_IMAGES: Record<CharacterMood, string> = {
  base: `${BASE_PATH}/neutral.png`,
  happy: `${BASE_PATH}/happy.png`,
  sad: `${BASE_PATH}/sad.png`,
}

// Each action: a transparent looping webm where one exists, plus a static pose
// fallback. `pet` (waving) has no webm, so it is always the static pose.
export const ACTION_ASSETS: Record<CharacterAction, { webm: string | null; image: string }> = {
  water: { webm: `${BASE_PATH}/drinking.webm`, image: `${BASE_PATH}/drinking-ios.png` },
  food: { webm: `${BASE_PATH}/eating.webm`, image: `${BASE_PATH}/eating-ios.png` },
  sleep: { webm: `${BASE_PATH}/sleeping.webm`, image: `${BASE_PATH}/sleeping-ios.png` },
  sport: { webm: `${BASE_PATH}/sport.webm`, image: `${BASE_PATH}/sport-ios.png` },
  pet: { webm: null, image: `${BASE_PATH}/waving-ios.png` },
}

// Static pose instead of video on iOS (alpha video renders black) and Safari
// (no alpha-WebM support).
export const prefersStaticPose = (): boolean => {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  const isIOS =
    /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isSafari = /safari/i.test(ua) && !/chrome|chromium|crios|fxios|android|edg/i.test(ua)
  return isIOS || isSafari
}
