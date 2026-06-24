import { createSlice } from '@reduxjs/toolkit'
import { loadEntriesThunk, saveEntryThunk } from '@/diary/data-access/store/diary.thunks'
import type { DiaryState } from '@/diary/data-access/store/diary.types'

const initialState: DiaryState = {
  entries: [],
  status: 'idle',
  saveStatus: 'idle',
  error: null,
}

const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    resetSaveStatus: (state) => {
      state.saveStatus = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadEntriesThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadEntriesThunk.fulfilled, (state, action) => {
        state.status = 'ready'
        state.entries = action.payload
      })
      .addCase(loadEntriesThunk.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload ?? action.error.message ?? 'diary.error.loadFailed'
      })
      .addCase(saveEntryThunk.pending, (state) => {
        state.saveStatus = 'saving'
      })
      .addCase(saveEntryThunk.fulfilled, (state, action) => {
        state.saveStatus = 'saved'
        state.entries = [action.payload, ...state.entries]
      })
      .addCase(saveEntryThunk.rejected, (state, action) => {
        state.saveStatus = 'error'
        state.error = action.payload ?? action.error.message ?? 'diary.error.saveFailed'
      })
  },
})

export const { resetSaveStatus } = diarySlice.actions

export default diarySlice.reducer
