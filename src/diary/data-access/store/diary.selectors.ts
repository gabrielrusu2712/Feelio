import type { RootState } from '@/core/store/store'

const selectDiary = (state: RootState) => state.diary

export const selectDiaryEntries = (state: RootState) => selectDiary(state).entries

export const selectDiaryStatus = (state: RootState) => selectDiary(state).status

export const selectDiarySaveStatus = (state: RootState) => selectDiary(state).saveStatus
