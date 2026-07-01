import type { CategoryKey } from '@/wellbeing/data-access/constants/wellbeing.constants'

// Highest completed level per category (0..DAILY_LEVELS). The active
// (next playable) level is always completedLevels[cat] + 1.
export type CompletedLevels = Record<CategoryKey, number>

export type WellbeingStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface WellbeingState {
  selectedCategory: CategoryKey
  completedLevels: CompletedLevels
  status: WellbeingStatus
  error: string | null
}
