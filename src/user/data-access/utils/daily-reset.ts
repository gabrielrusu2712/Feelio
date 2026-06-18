import { DEFAULT_STATS } from '@/user/data-access/store/user.constants'
import type { Stats } from '@/user/data-access/store/user.types'

export interface DailyResetInput {
  stats: Stats
  totalDays: number
  lastVisitDate?: string
}

export interface DailyResetResult {
  stats: Stats
  totalDays: number
  didReset: boolean
}

// Pure new-day reset: if the last recorded visit was on a different day, the
// stat bars zero out and the day counter advances. A first-ever visit (no
// lastVisitDate) is NOT a reset.
export const applyNewDayReset = (input: DailyResetInput, today: string): DailyResetResult => {
  const isNewDay = Boolean(input.lastVisitDate) && input.lastVisitDate !== today

  if (isNewDay) {
    return { stats: { ...DEFAULT_STATS }, totalDays: input.totalDays + 1, didReset: true }
  }

  return { stats: input.stats, totalDays: input.totalDays, didReset: false }
}
