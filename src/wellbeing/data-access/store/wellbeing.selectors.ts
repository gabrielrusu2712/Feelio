import type { RootState } from '@/core/store/store'

const selectWellbeingState = (state: RootState) => state.wellbeing

export const selectSelectedCategory = (state: RootState) =>
  selectWellbeingState(state).selectedCategory

export const selectCompletedLevels = (state: RootState) =>
  selectWellbeingState(state).completedLevels

export const selectWellbeingStatus = (state: RootState) => selectWellbeingState(state).status
