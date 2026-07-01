import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/core/services/firebase'
import { DEFAULT_STATS, STAT_KEYS } from '@/user/data-access/store/user.constants'
import type { Stats } from '@/user/data-access/store/user.types'

const USERS_COLLECTION = 'users'
const LOGIN_DAYS_COLLECTION = 'loginDays'

// Raw shape as stored in Firestore. May also carry Timestamp fields
// (createdAt / lastUsernameChange) that we deliberately never read into Redux.
export interface UserDocument {
  username?: string
  stats?: Partial<Stats>
  totalDays?: number
  totalStars?: number
  xp?: number
  playerLevel?: number
  // Per-category challenge progress, owned by the wellbeing domain but stored in
  // this same user doc. Typed generically here so the raw-doc shape stays
  // category-agnostic; the wellbeing layer normalizes it.
  completedLevels?: Record<string, number>
  // Date key of the last completed/reset challenge day; the wellbeing daily reset
  // compares it against today (owned by the wellbeing domain).
  lastChallengeDate?: string
  lastVisitDate?: string
}

const userDocRef = (uid: string) => doc(db, USERS_COLLECTION, uid)

// Coerces a partial/missing stats map into a full, numeric Stats object.
export const normalizeStats = (stats?: Partial<Stats>): Stats =>
  STAT_KEYS.reduce((acc, key) => {
    acc[key] = stats?.[key] ?? 0
    return acc
  }, {} as Stats)

export const createUserDocument = async (uid: string, username: string): Promise<void> => {
  await setDoc(userDocRef(uid), {
    createdAt: new Date().toISOString(),
    totalDays: 1,
    stats: DEFAULT_STATS,
    username,
    totalStars: 0,
    xp: 0,
    playerLevel: 1,
  })
}

export const fetchUserDocument = async (uid: string): Promise<UserDocument | null> => {
  const snapshot = await getDoc(userDocRef(uid))
  return snapshot.exists() ? (snapshot.data() as UserDocument) : null
}

export const updateUserDocument = async (
  uid: string,
  data: Partial<UserDocument>,
): Promise<void> => {
  await updateDoc(userDocRef(uid), data)
}

export const recordLoginDay = async (uid: string, dateKey: string): Promise<void> => {
  const loginDayRef = doc(collection(userDocRef(uid), LOGIN_DAYS_COLLECTION), dateKey)
  await setDoc(
    loginDayRef,
    { date: dateKey, loggedIn: true, timestamp: new Date().toISOString() },
    { merge: true },
  )
}
