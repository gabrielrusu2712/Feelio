import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {
  DEFAULT_STATS,
  STAT_TARGETS,
  STARS_PER_LEVEL_UP,
  XP_PER_LEVEL,
} from '@/user/data-access/store/user.constants'
import { loadUserDataThunk } from '@/user/data-access/store/user.thunks'
import type { Stats, UserProfile, UserState } from '@/user/data-access/store/user.types'

const initialState: UserState = {
  username: null,
  stats: DEFAULT_STATS,
  totalDays: 1,
  xp: 0,
  playerLevel: 1,
  totalStars: 0,
  status: 'idle',
  error: null,
}

const applyProfile = (state: UserState, profile: UserProfile) => {
  state.username = profile.username
  state.stats = profile.stats
  state.totalDays = profile.totalDays
  state.xp = profile.xp
  state.playerLevel = profile.playerLevel
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
    // Bumps a stat by a (signed) delta, clamped to [0, daily target]. The save
    // to Firestore is a side-effect dispatched from the component, not here.
    adjustStat: (state, action: PayloadAction<{ key: keyof Stats; delta: number }>) => {
      const { key, delta } = action.payload
      const next = state.stats[key] + delta
      state.stats[key] = Math.min(STAT_TARGETS[key], Math.max(0, next))
    },
    // Adds challenge XP and rolls it over into player levels: every full
    // XP_PER_LEVEL bumps playerLevel and grants STARS_PER_LEVEL_UP stars. Pure
    // player-economy math; the cross-slice wellbeing bump + category advance are
    // orchestrated in the awardChallenge thunk, not here. Loops so an unusually
    // large gain can clear more than one level. Persisting is a thunk side-effect.
    awardXp: (state, action: PayloadAction<{ amount: number }>) => {
      let xp = state.xp + Math.max(0, action.payload.amount)
      while (xp >= XP_PER_LEVEL) {
        xp -= XP_PER_LEVEL
        state.playerLevel += 1
        state.totalStars += STARS_PER_LEVEL_UP
      }
      state.xp = xp
    },
    // Direct stars delta (spend/earn), bypassing the xp→level rollover — used by
    // the game economy (entry cost, session payout), which grants/removes stars
    // straight from the pool rather than through challenge xp. Persisting is a
    // thunk side-effect.
    adjustStars: (state, action: PayloadAction<{ delta: number }>) => {
      state.totalStars = Math.max(0, state.totalStars + action.payload.delta)
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

export const { setUserData, adjustStat, awardXp, adjustStars, resetUserData } = userSlice.actions

export default userSlice.reducer
