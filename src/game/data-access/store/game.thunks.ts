import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@/core/store/store'
import { updateUserDocument } from '@/user/data-access/api/user.api'
import { adjustStars } from '@/user/data-access/store/user.slice'

// Spends the entry cost from the shared player economy (`user.totalStars`).
// Returns whether the spend succeeded so the caller can gate entering
// `playing`; insufficient balance is a normal outcome, not an error.
export const spendStarsToPlayThunk = createAsyncThunk<
  boolean,
  { uid: string; cost: number },
  { state: RootState; rejectValue: string }
>('game/spendStarsToPlay', async (args, { getState, dispatch, rejectWithValue }) => {
  const { uid, cost } = args
  if (getState().user.totalStars < cost) return false

  dispatch(adjustStars({ delta: -cost }))
  try {
    await updateUserDocument(uid, { totalStars: getState().user.totalStars })
    return true
  } catch (error) {
    dispatch(adjustStars({ delta: cost })) // roll back the optimistic spend
    return rejectWithValue(error instanceof Error ? error.message : 'game.error.spendFailed')
  }
})

// Pays out the stars collected during a session on game-over.
export const awardSessionStarsThunk = createAsyncThunk<
  void,
  { uid: string; stars: number },
  { state: RootState; rejectValue: string }
>('game/awardSessionStars', async (args, { getState, dispatch, rejectWithValue }) => {
  const { uid, stars } = args
  if (stars <= 0) return

  dispatch(adjustStars({ delta: stars }))
  try {
    await updateUserDocument(uid, { totalStars: getState().user.totalStars })
  } catch (error) {
    dispatch(adjustStars({ delta: -stars })) // roll back the optimistic payout so local matches Firestore
    return rejectWithValue(error instanceof Error ? error.message : 'game.error.awardFailed')
  }
})
