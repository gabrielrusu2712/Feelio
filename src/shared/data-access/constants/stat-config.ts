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

export const STAT_FILL_TEXTURES: Partial<Record<keyof Stats, FillTexture>> = {
  water: { src: '/assets/stats/water_bar.png', ratio: 74.64, scale: 0.6 }, // 1171 × 874
  food: { src: '/assets/stats/food_bar.png', ratio: 75.34, scale: 0.7 }, // 1160 × 874
  sleep: { src: '/assets/stats/sleep_bar.png', ratio: 57.76, scale: 0.5 }, // 1160 × 670
  sport: { src: '/assets/stats/sport_bar.png', ratio: 32.52 }, // 1550 × 504
  wellbeing: { src: '/assets/stats/wellbeing_bar.png', ratio: 34.42 }, // 2420 × 833
}

// Per-stat fill colour, read from the theme palette at render time. Shared by
// the desktop (vertical) and portrait (horizontal) bars so they stay in sync.
export const getStatAccents = (theme: DefaultTheme): Record<keyof Stats, string> => ({
  water: theme.primitives.palette.blue['400'].cssVar,
  sleep: theme.primitives.palette.indigo['400'].cssVar,
  food: theme.primitives.palette.orange['400'].cssVar,
  sport: theme.primitives.palette.green['500'].cssVar,
  wellbeing: theme.primitives.palette.brand['500'].cssVar,
})
