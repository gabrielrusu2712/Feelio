import { collection, doc, getDoc, runTransaction, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/core/services/firebase'
import { DEFAULT_STATS, STAT_KEYS } from '@/user/data-access/store/user.constants'
import { USERNAME_MAX_LENGTH } from '@/user/data-access/utils/username'
import type { Stats } from '@/user/data-access/store/user.types'

const USERS_COLLECTION = 'users'
const USERNAMES_COLLECTION = 'usernames'
const LOGIN_DAYS_COLLECTION = 'loginDays'
const DAILY_MOODS_COLLECTION = 'dailyMoods'

// How many suffixed candidates (`name`, `name2`, … `name50`) registration tries
// before giving up and appending a uid fragment — a safety net that realistically
// never trips.
const MAX_SUFFIX_ATTEMPTS = 50

// Raw shape as stored in Firestore. May also carry Timestamp fields
// (createdAt / lastUsernameChange) that we deliberately never read into Redux.
export interface UserDocument {
  username?: string
  // Normalized reservation key mirroring `usernames/{usernameLower}`. Absent on
  // legacy docs created before uniqueness was enforced (backfilled on load).
  usernameLower?: string
  // ISO string of the last username change; drives the 30-day rename cooldown.
  lastUsernameChange?: string
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

const usernameDocRef = (usernameLower: string) => doc(db, USERNAMES_COLLECTION, usernameLower)

// Thrown (as an i18n error key) when a reservation is already held by someone
// else. Callers translate it via t(error, { defaultValue: error }).
export const USERNAME_TAKEN_ERROR = 'user.error.usernameTaken'

// Atomically reserves `usernames/{usernameLower}` for this uid. The read+write
// happen in one transaction, so two clients racing for the same name can't both
// win. Rejects with USERNAME_TAKEN_ERROR when the name belongs to another uid;
// re-reserving your own name is a no-op success.
export const claimUsername = async (
  uid: string,
  usernameLower: string,
  username: string,
): Promise<void> => {
  await runTransaction(db, async (tx) => {
    const ref = usernameDocRef(usernameLower)
    const snapshot = await tx.get(ref)
    if (snapshot.exists() && snapshot.data().uid !== uid) {
      throw new Error(USERNAME_TAKEN_ERROR)
    }
    tx.set(ref, { uid, username })
  })
}

// Registration helper: claims `base`, or the first free `base2`, `base3`, …
// Returns the display name + normalized key actually reserved so the caller can
// store both on the user doc. Only USERNAME_TAKEN_ERROR is swallowed to advance
// the suffix; any other failure (permissions, network) propagates.
export const claimAvailableUsername = async (
  uid: string,
  base: string,
): Promise<{ username: string; usernameLower: string }> => {
  for (let attempt = 1; attempt <= MAX_SUFFIX_ATTEMPTS; attempt += 1) {
    const suffix = attempt === 1 ? '' : String(attempt)
    // Keep the whole candidate within the max length by trimming the base, not
    // the numeric suffix.
    const username = base.slice(0, USERNAME_MAX_LENGTH - suffix.length) + suffix
    const usernameLower = username.toLowerCase()
    try {
      await claimUsername(uid, usernameLower, username)
      return { username, usernameLower }
    } catch (error) {
      if (error instanceof Error && error.message === USERNAME_TAKEN_ERROR) continue
      throw error
    }
  }
  // Astronomically unlikely fallback: disambiguate with a uid fragment.
  const fragment = uid.slice(0, 6)
  const username = base.slice(0, USERNAME_MAX_LENGTH - fragment.length) + fragment
  const usernameLower = username.toLowerCase()
  await claimUsername(uid, usernameLower, username)
  return { username, usernameLower }
}

// Renames a user: reserves the new name, releases the previous reservation, and
// updates the user doc (with a fresh lastUsernameChange) — all in one
// transaction so a rename never leaves a dangling or double reservation. Rejects
// with USERNAME_TAKEN_ERROR when the target belongs to someone else.
export const changeUsername = async (args: {
  uid: string
  username: string
  usernameLower: string
  previousLower?: string
  changedAt: string
}): Promise<void> => {
  const { uid, username, usernameLower, previousLower, changedAt } = args
  await runTransaction(db, async (tx) => {
    const nextRef = usernameDocRef(usernameLower)
    const snapshot = await tx.get(nextRef)
    if (snapshot.exists() && snapshot.data().uid !== uid) {
      throw new Error(USERNAME_TAKEN_ERROR)
    }
    // All reads must precede writes within a transaction.
    tx.set(nextRef, { uid, username })
    if (previousLower && previousLower !== usernameLower) {
      tx.delete(usernameDocRef(previousLower))
    }
    tx.update(userDocRef(uid), { username, usernameLower, lastUsernameChange: changedAt })
  })
}

// Coerces a partial/missing stats map into a full, numeric Stats object.
export const normalizeStats = (stats?: Partial<Stats>): Stats =>
  STAT_KEYS.reduce((acc, key) => {
    acc[key] = stats?.[key] ?? 0
    return acc
  }, {} as Stats)

export const createUserDocument = async (
  uid: string,
  username: string,
  usernameLower: string,
): Promise<void> => {
  await setDoc(userDocRef(uid), {
    createdAt: new Date().toISOString(),
    totalDays: 1,
    stats: DEFAULT_STATS,
    username,
    usernameLower,
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

// Writes the day's wellbeing snapshot (avg completion % + coarse mood bucket) to
// users/{uid}/dailyMoods/{dateKey}. This is the per-day series the statistics
// dashboard reads; the source wrote it on every stat save (data.ts), so we mirror
// that from saveStatsThunk. Merge so repeated saves in a day overwrite the value.
export const saveDailyMoodSnapshot = async (
  uid: string,
  dateKey: string,
  avgPercent: number,
  mood: number,
): Promise<void> => {
  const snapshotRef = doc(collection(userDocRef(uid), DAILY_MOODS_COLLECTION), dateKey)
  await setDoc(
    snapshotRef,
    { avgPercent, mood, timestamp: new Date().toISOString() },
    { merge: true },
  )
}
