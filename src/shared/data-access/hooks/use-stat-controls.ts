import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/core/store'
import { selectUid } from '@/shared/data-access/store/current-user.selectors'
import { triggerCharacterAction } from '@/shared/data-access/store/character-action.slice'
import { STAT_ACTIONS } from '@/shared/data-access/constants/character'
import { adjustStat, saveStatsThunk, selectStats } from '@/user/data-access/store'
import { STAT_INCREMENTS } from '@/user/data-access/store/user.constants'
import type { Stats } from '@/user/data-access/store'

// Shared by the desktop and portrait stat panels: bumps a stat by its per-tap
// step (clamped in the reducer), syncs to Firestore, and on a positive bump
// asks the character to play the matching animation.
export const useStatControls = () => {
  const dispatch = useAppDispatch()
  const stats = useAppSelector(selectStats)
  const uid = useAppSelector(selectUid)

  const adjust = useCallback(
    (key: keyof Stats, direction: 1 | -1) => {
      dispatch(adjustStat({ key, delta: STAT_INCREMENTS[key] * direction }))
      // adjustStat is synchronous, so the thunk reads the updated stats.
      if (uid) void dispatch(saveStatsThunk({ uid }))

      const action = STAT_ACTIONS[key]
      if (direction === 1 && action) dispatch(triggerCharacterAction(action))
    },
    [dispatch, uid],
  )

  return { stats, adjust }
}
