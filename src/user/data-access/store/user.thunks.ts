import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  changeUsername,
  claimAvailableUsername,
  fetchUserDocument,
  normalizeStats,
  recordLoginDay,
  saveDailyMoodSnapshot,
  updateUserDocument,
} from '@/user/data-access/api/user.api'
import { STAT_TARGETS } from '@/user/data-access/store/user.constants'
import { setUsername } from '@/user/data-access/store/user.slice'
import { applyNewDayReset } from '@/user/data-access/utils/daily-reset'
import { toDateKey } from '@/user/data-access/utils/date-key'
import { avgPercent, percentToMood } from '@/user/data-access/utils/mood'
import { canChangeUsername } from '@/user/data-access/utils/username-cooldown'
import { normalizeUsername, validateUsername } from '@/user/data-access/utils/username'
import { selectUid } from '@/shared/data-access/store/current-user.selectors'
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
        lastUsernameChange: null,
        stats: normalizeStats(),
        totalDays: 1,
        xp: 0,
        playerLevel: 1,
        totalStars: 0,
      }
    }

    let username = document.username ?? fallbackUsername
    // Backfill the uniqueness reservation for legacy docs created before it was
    // enforced. Best-effort: a failure here must never block loading the app, so
    // we swallow it and keep the existing display name.
    if (!document.usernameLower) {
      try {
        const claimed = await claimAvailableUsername(args.uid, normalizeUsername(username))
        username = claimed.username
        await updateUserDocument(args.uid, {
          username: claimed.username,
          usernameLower: claimed.usernameLower,
        })
      } catch {
        if (!document.username) await updateUserDocument(args.uid, { username })
      }
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
      lastUsernameChange: document.lastUsernameChange ?? null,
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

// Renames the current user. Validates format and the 30-day cooldown locally,
// then reserves the new name (releasing the old) via an atomic transaction. On
// success it reflects the change into state and returns the new name; on a
// collision or any other failure it rejects with an i18n error key that the
// settings form surfaces via t(error, { defaultValue: error }).
export const changeUsernameThunk = createAsyncThunk<
  { username: string; lastUsernameChange: string },
  { desired: string },
  { state: RootState; rejectValue: string }
>('user/changeUsername', async (args, { getState, dispatch, rejectWithValue }) => {
  const state = getState()
  // Read the uid through the shared selector — the one sanctioned place that
  // touches the auth slice, so this domain never reaches into auth state itself.
  const uid = selectUid(state)
  if (!uid) return rejectWithValue('auth.error.notLoggedIn')

  const formatError = validateUsername(args.desired)
  if (formatError) return rejectWithValue(formatError)

  const usernameLower = normalizeUsername(args.desired)
  const previousLower = state.user.username ? normalizeUsername(state.user.username) : undefined

  if (usernameLower === previousLower) return rejectWithValue('user.error.usernameSame')

  const lastChange = state.user.lastUsernameChange ? new Date(state.user.lastUsernameChange) : null
  if (!canChangeUsername(lastChange)) return rejectWithValue('user.error.usernameCooldown')

  const changedAt = new Date().toISOString()
  const username = args.desired.trim()

  try {
    await changeUsername({ uid, username, usernameLower, previousLower, changedAt })
    dispatch(setUsername({ username, lastUsernameChange: changedAt }))
    return { username, lastUsernameChange: changedAt }
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'user.error.saveFailed')
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
    const stats = getState().user.stats
    const today = toDateKey()
    const percent = avgPercent(stats, STAT_TARGETS)
    // Persist the main doc and today's dailyMoods snapshot together — the snapshot
    // is the per-day series the statistics dashboard charts.
    await Promise.all([
      updateUserDocument(args.uid, { stats, lastVisitDate: today }),
      saveDailyMoodSnapshot(args.uid, today, percent, percentToMood(percent)),
    ])
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'user.error.saveFailed')
  }
})
