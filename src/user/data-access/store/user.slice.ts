import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DEFAULT_STATS } from '@/user/data-access/store/user.constants'
import { loadUserDataThunk } from '@/user/data-access/store/user.thunks'
import type { UserProfile, UserState } from '@/user/data-access/store/user.types'

const initialState: UserState = {
  username: null,
  stats: DEFAULT_STATS,
  totalDays: 1,
  totalStars: 0,
  status: 'idle',
  error: null,
}

const applyProfile = (state: UserState, profile: UserProfile) => {
  state.username = profile.username
  state.stats = profile.stats
  state.totalDays = profile.totalDays
  state.totalStars = profile.totalStars
  state.status = 'ready'
  state.error = null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserProfile>) => {
      applyProfile(state, action.payload)
    },
    // Cleared on logout so a subsequent login never shows stale data.
    resetUserData: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserDataThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadUserDataThunk.fulfilled, (state, action) => {
        applyProfile(state, action.payload)
      })
      .addCase(loadUserDataThunk.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload ?? action.error.message ?? 'user.error.loadFailed'
      })
  },
})

export const { setUserData, resetUserData } = userSlice.actions

export default userSlice.reducer
