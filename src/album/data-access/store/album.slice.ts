import { createSlice } from '@reduxjs/toolkit'
import { loadEntriesThunk, savePhotoThunk } from '@/album/data-access/store/album.thunks'
import type { AlbumState } from '@/album/data-access/store/album.types'

const initialState: AlbumState = {
  entries: [],
  status: 'idle',
  saveStatus: 'idle',
  error: null,
  lastRewardStars: null,
}

const albumSlice = createSlice({
  name: 'album',
  initialState,
  reducers: {
    resetSaveStatus: (state) => {
      state.saveStatus = 'idle'
      state.lastRewardStars = null
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
        state.error = action.payload ?? action.error.message ?? 'album.error.loadFailed'
      })
      .addCase(savePhotoThunk.pending, (state) => {
        state.saveStatus = 'saving'
      })
      .addCase(savePhotoThunk.fulfilled, (state, action) => {
        state.saveStatus = 'saved'
        state.entries = [action.payload.entry, ...state.entries]
        state.lastRewardStars = action.payload.starsEarned > 0 ? action.payload.starsEarned : null
      })
      .addCase(savePhotoThunk.rejected, (state, action) => {
        state.saveStatus = 'error'
        state.error = action.payload ?? action.error.message ?? 'album.error.saveFailed'
      })
  },
})

export const { resetSaveStatus } = albumSlice.actions

export default albumSlice.reducer
