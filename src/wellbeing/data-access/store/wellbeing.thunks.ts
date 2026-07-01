import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@/core/store/store'
import { fetchUserDocument } from '@/user/data-access/api/user.api'
import { adjustStat, awardXp } from '@/user/data-access/store/user.slice'
import { STAT_TARGETS } from '@/user/data-access/store/user.constants'
import { toDateKey } from '@/user/data-access/utils/date-key'
import { normalizeProgress, saveChallengeProgress } from '@/wellbeing/data-access/api/wellbeing.api'
import { CATEGORY_XP, zeroProgress } from '@/wellbeing/data-access/constants/wellbeing.constants'
import type { CategoryKey } from '@/wellbeing/data-access/constants/wellbeing.constants'
import { advanceCategory } from '@/wellbeing/data-access/store/wellbeing.slice'
import type { CompletedLevels } from '@/wellbeing/data-access/store/wellbeing.types'

// Loads per-category progress from the user doc. A new day (or first visit) wipes
// progress and persists the reset, mirroring the source's daily challenge reset.
export const loadChallengeProgressThunk = createAsyncThunk<
  CompletedLevels,
  { uid: string },
  { rejectValue: string }
>('wellbeing/loadProgress', async (args, { rejectWithValue }) => {
  try {
    const today = toDateKey()
    const document = await fetchUserDocument(args.uid)

    if (!document || document.lastChallengeDate !== today) {
      const fresh = zeroProgress()
      await saveChallengeProgress(args.uid, { completedLevels: fresh, lastChallengeDate: today })
      return fresh
    }

    return normalizeProgress(document.completedLevels)
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'wellbeing.error.loadFailed')
  }
})

// The challenge-completion economy (the cross-slice "smart handler" from the
// migration plan). Only the active level (completed + 1) awards — replaying a
// done level is a no-op. Award-both rule: every completed challenge grants the
// category's XP AND, while the vibe stat is below target, bumps it by one. Then
// the category advances and the whole player+progress state is persisted in one
// merge. XP→level→stars rollover lives in the user slice (awardXp).
export const awardChallengeThunk = createAsyncThunk<
  void,
  { uid: string; category: CategoryKey; level: number },
  { state: RootState; rejectValue: string }
>('wellbeing/awardChallenge', async (args, { getState, dispatch, rejectWithValue }) => {
  const { uid, category, level } = args
  const completed = getState().wellbeing.completedLevels[category]
  if (level !== completed + 1) return

  try {
    if (getState().user.stats.wellbeing < STAT_TARGETS.wellbeing) {
      dispatch(adjustStat({ key: 'wellbeing', delta: 1 }))
    }
    dispatch(awardXp({ amount: CATEGORY_XP[category] }))
    dispatch(advanceCategory({ category }))

    const next = getState()
    await saveChallengeProgress(uid, {
      stats: next.user.stats,
      xp: next.user.xp,
      playerLevel: next.user.playerLevel,
      totalStars: next.user.totalStars,
      completedLevels: next.wellbeing.completedLevels,
      lastChallengeDate: toDateKey(),
    })
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'wellbeing.error.saveFailed')
  }
})
