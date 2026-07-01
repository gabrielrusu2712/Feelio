import type { RootState } from '@/core/store/store'

const selectUserState = (state: RootState) => state.user

export const selectUsername = (state: RootState) => selectUserState(state).username

export const selectStats = (state: RootState) => selectUserState(state).stats

export const selectTotalDays = (state: RootState) => selectUserState(state).totalDays

export const selectTotalStars = (state: RootState) => selectUserState(state).totalStars

export const selectXp = (state: RootState) => selectUserState(state).xp

export const selectPlayerLevel = (state: RootState) => selectUserState(state).playerLevel
