import type { DefaultTheme } from 'styled-components'
import type { Stats } from '@/user/data-access/store'

export interface StatBarConfig {
  key: keyof Stats
  /** Icon texture (public path) that rides the fill edge. */
  icon: string
  labelKey: string
}

export const STAT_BARS: StatBarConfig[] = [
  { key: 'water', icon: '/assets/stats/water.png', labelKey: 'shell.stat.water' },
  { key: 'sleep', icon: '/assets/stats/sleep.png', labelKey: 'shell.stat.sleep' },
  { key: 'food', icon: '/assets/stats/food.png', labelKey: 'shell.stat.food' },
  { key: 'sport', icon: '/assets/stats/sport.png', labelKey: 'shell.stat.sport' },
  { key: 'wellbeing', icon: '/assets/stats/wellbeing.png', labelKey: 'shell.stat.wellbeing' },
]

// Some bars fill with an animated, seamlessly-tiled texture (scrolled behind the
// bar's window) instead of a flat colour. `ratio` is the texture's height ÷ width
// as a percentage, so each tile stays aspect-correct (and the scroll stays
// seamless) regardless of the source image's proportions. `scale` sets the tile
// width as a fraction of the bar's length (1 = one tile spans the bar; smaller =
// the texture repeats more often / looks smaller).
export interface FillTexture {
  src: string
  ratio: number
  scale?: number
}

// Only the vibe/wellbeing bar fills with an animated texture. The other stat
// bars use a flat accent colour (see getStatAccents) — no texture, no glint.
export const STAT_FILL_TEXTURES: Partial<Record<keyof Stats, FillTexture>> = {
  wellbeing: { src: '/assets/stats/wellbeing_bar.png', ratio: 34.42 }, // 2420 × 833
}

// Stat fill colour, read from the theme palette at render time. Every bar uses
// the one brand accent (like the old project's single terracotta fill); the
// track behind it is theme-aware, so the bar's look still adapts per theme.
// Shared by the desktop (vertical) and portrait (horizontal) bars.
export const getStatAccents = (theme: DefaultTheme): Record<keyof Stats, string> => {
  const accent = theme.primitives.palette.brand['500'].cssVar
  return { water: accent, sleep: accent, food: accent, sport: accent, wellbeing: accent }
}
