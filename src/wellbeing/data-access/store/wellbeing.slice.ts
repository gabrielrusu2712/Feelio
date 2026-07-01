import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DAILY_LEVELS, zeroProgress } from '@/wellbeing/data-access/constants/wellbeing.constants'
import type { CategoryKey } from '@/wellbeing/data-access/constants/wellbeing.constants'
import { loadChallengeProgressThunk } from '@/wellbeing/data-access/store/wellbeing.thunks'
import type { WellbeingState } from '@/wellbeing/data-access/store/wellbeing.types'

const initialState: WellbeingState = {
  selectedCategory: 'fizic',
  completedLevels: zeroProgress(),
  status: 'idle',
  error: null,
}

const wellbeingSlice = createSlice({
  name: 'wellbeing',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<CategoryKey>) => {
      state.selectedCategory = action.payload
    },
    // Advances a category after its active level is completed, capping at
    // DAILY_LEVELS (the whole climb done — locked until the next day's reset; no
    // wrap/replay). The wellbeing-stat bump + XP award are dispatched by the
    // awardChallenge thunk; this only moves the per-category progress.
    advanceCategory: (state, action: PayloadAction<{ category: CategoryKey }>) => {
      const current = state.completedLevels[action.payload.category]
      state.completedLevels[action.payload.category] = Math.min(current + 1, DAILY_LEVELS)
    },
    resetWellbeing: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadChallengeProgressThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadChallengeProgressThunk.fulfilled, (state, action) => {
        state.completedLevels = action.payload
        state.status = 'ready'
      })
      .addCase(loadChallengeProgressThunk.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload ?? action.error.message ?? 'wellbeing.error.loadFailed'
      })
  },
})

export const { setCategory, advanceCategory, resetWellbeing } = wellbeingSlice.actions

export default wellbeingSlice.reducer
