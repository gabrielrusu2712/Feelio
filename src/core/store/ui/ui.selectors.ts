import type { RootState } from '@/core/store/store'

const selectUi = (state: RootState) => state.ui

export const selectLoading = (state: RootState) => selectUi(state).loading
