import type { RootState } from '@/core/store/store'

const selectUserState = (state: RootState) => state.user

export const selectUsername = (state: RootState) => selectUserState(state).username

export const selectTotalDays = (state: RootState) => selectUserState(state).totalDays
