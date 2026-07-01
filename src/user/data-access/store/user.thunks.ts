import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchUserDocument,
  normalizeStats,
  recordLoginDay,
  updateUserDocument,
} from '@/user/data-access/api/user.api'
import { applyNewDayReset } from '@/user/data-access/utils/daily-reset'
import { toDateKey } from '@/user/data-access/utils/date-key'
import type { UserProfile } from '@/user/data-access/store/user.types'
import type { RootState } from '@/core/store/store'

interface LoadUserArgs {
  uid: string
  email: string | null
}

// Records today's login, loads the per-user document, applies the new-day reset,
// and returns a normalized profile. Saving stats back is deferred to Phase 3.
export const loadUserDataThunk = createAsyncThunk<
  UserProfile,
  LoadUserArgs,
  { rejectValue: string }
>('user/loadData', async (args, { rejectWithValue }) => {
  try {
    const today = toDateKey()
    await recordLoginDay(args.uid, today)

    const fallbackUsername = args.email?.split('@')[0] ?? 'feelio'
    const document = await fetchUserDocument(args.uid)

    if (!document) {
      return {
        username: fallbackUsername,
        stats: normalizeStats(),
        totalDays: 1,
        xp: 0,
        playerLevel: 1,
        totalStars: 0,
      }
    }

    const username = document.username ?? fallbackUsername
    if (!document.username) {
      await updateUserDocument(args.uid, { username })
    }

    const reset = applyNewDayReset(
      {
        stats: normalizeStats(document.stats),
        totalDays: document.totalDays ?? 1,
        lastVisitDate: document.lastVisitDate,
      },
      today,
    )

    if (reset.didReset) {
      await updateUserDocument(args.uid, {
        stats: reset.stats,
        totalDays: reset.totalDays,
        lastVisitDate: today,
      })
    }

    return {
      username,
      stats: reset.stats,
      totalDays: reset.totalDays,
      xp: document.xp ?? 0,
      playerLevel: document.playerLevel ?? 1,
      totalStars: document.totalStars ?? 0,
    }
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'user.error.loadFailed')
  }
})

// Persists the current stats map to Firestore (merge). Reads the latest stats
// from state so callers just dispatch it after an optimistic `adjustStat`.
export const saveStatsThunk = createAsyncThunk<
  void,
  { uid: string },
  { state: RootState; rejectValue: string }
>('user/saveStats', async (args, { getState, rejectWithValue }) => {
  try {
    await updateUserDocument(args.uid, { stats: getState().user.stats })
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'user.error.saveFailed')
  }
})
