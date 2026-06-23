import type { DefaultTheme } from 'styled-components'
import type { Stats } from '@/user/data-access/store'

export interface StatBarConfig {
  key: keyof Stats
  icon: string
  labelKey: string
}

// Placeholder daily targets — Phase 2's home domain owns the canonical targets.
export const STAT_TARGETS: Stats = { water: 8, sleep: 8, food: 3, sport: 1, wellbeing: 5 }

export const STAT_BARS: StatBarConfig[] = [
  { key: 'water', icon: '💧', labelKey: 'shell.stat.water' },
  { key: 'sleep', icon: '🌙', labelKey: 'shell.stat.sleep' },
  { key: 'food', icon: '🍲', labelKey: 'shell.stat.food' },
  { key: 'sport', icon: '🏀', labelKey: 'shell.stat.sport' },
  { key: 'wellbeing', icon: '🎈', labelKey: 'shell.stat.wellbeing' },
]

// Per-stat fill colour, read from the theme palette at render time. Shared by
// the desktop (vertical) and portrait (horizontal) bars so they stay in sync.
export const getStatAccents = (theme: DefaultTheme): Record<keyof Stats, string> => ({
  water: theme.primitives.palette.blue['400'].cssVar,
  sleep: theme.primitives.palette.indigo['400'].cssVar,
  food: theme.primitives.palette.orange['400'].cssVar,
  sport: theme.primitives.palette.green['500'].cssVar,
  wellbeing: theme.primitives.palette.brand['500'].cssVar,
})
