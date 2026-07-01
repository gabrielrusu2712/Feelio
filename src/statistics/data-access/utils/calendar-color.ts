import {
  MINT_END_RGB,
  ORANGE_START_RGB,
} from '@/statistics/data-access/constants/statistics.constants'

export const clampPercent = (value: number): number => {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(100, value))
}

// One decimal, dropping a trailing ".0" (e.g. "83%" / "42.5%").
export const formatPercent = (value: number): string => {
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`
}

const lerp = (start: number, end: number, t: number): number => start + (end - start) * t

// Interpolates the terracotta→mint gradient for a completion %.
export const getProgressColor = (percent: number): string => {
  const t = clampPercent(percent) / 100
  const r = Math.round(lerp(ORANGE_START_RGB[0], MINT_END_RGB[0], t))
  const g = Math.round(lerp(ORANGE_START_RGB[1], MINT_END_RGB[1], t))
  const b = Math.round(lerp(ORANGE_START_RGB[2], MINT_END_RGB[2], t))
  return `rgb(${r}, ${g}, ${b})`
}

const extractRgbChannels = (rgbColor: string): [number, number, number] => {
  const match = rgbColor.match(/\d+/g)
  if (!match || match.length < 3) return [255, 255, 255]
  return [Number(match[0]), Number(match[1]), Number(match[2])]
}

// Dark text on light cells, white on dark — keeps the day number readable across
// the whole gradient.
export const getReadableTextColor = (rgbColor: string): string => {
  const [r, g, b] = extractRgbChannels(rgbColor)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#173228' : '#ffffff'
}
