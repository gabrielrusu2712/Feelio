import { updateUserDocument } from '@/user/data-access/api/user.api'
import type { UserDocument } from '@/user/data-access/api/user.api'
import { CATEGORY_KEYS, DAILY_LEVELS } from '@/wellbeing/data-access/constants/wellbeing.constants'
import type { CompletedLevels } from '@/wellbeing/data-access/store/wellbeing.types'

// Challenge progress is stored on the same `users/{uid}` document the player
// economy lives on, so a challenge can persist stats + xp + level + stars +
// progress in one merge. The wellbeing layer owns these fields; the user api
// owns the document write.
export const saveChallengeProgress = async (
  uid: string,
  data: Partial<UserDocument>,
): Promise<void> => {
  await updateUserDocument(uid, data)
}

// Coerces the raw Firestore map into a valid per-category progress object,
// clamping anything out of range back to 0 (mirrors the source's self-heal).
export const normalizeProgress = (raw?: Record<string, number>): CompletedLevels =>
  CATEGORY_KEYS.reduce((acc, key) => {
    const value = raw?.[key]
    const valid =
      typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= DAILY_LEVELS
    acc[key] = valid ? value : 0
    return acc
  }, {} as CompletedLevels)
