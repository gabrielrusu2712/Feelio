import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '@/core/services/firebase'
import { clampPercent } from '@/statistics/data-access/utils/calendar-color'
import { stripTime } from '@/statistics/data-access/utils/date-range'
import type { DailyEntry } from '@/statistics/data-access/store/statistics.types'

// Read side of the statistics dashboard. Per-day docs are fetched individually
// (the source's fan-out); callers layer caching on top of these fetchers.

const dailyMoodRef = (uid: string, dateKey: string) =>
  doc(collection(doc(db, 'users', uid), 'dailyMoods'), dateKey)

const loginDayRef = (uid: string, dateKey: string) =>
  doc(collection(doc(db, 'users', uid), 'loginDays'), dateKey)

export const fetchDailyEntry = async (uid: string, dateKey: string): Promise<DailyEntry> => {
  try {
    const snapshot = await getDoc(dailyMoodRef(uid, dateKey))
    if (!snapshot.exists()) return { exists: false, percent: 0, mood: null }

    const data = snapshot.data()
    const rawMood = data.mood
    return {
      exists: true,
      percent: clampPercent(Number(data.avgPercent)),
      mood: rawMood === undefined || rawMood === null ? null : Number(rawMood),
    }
  } catch {
    return { exists: false, percent: 0, mood: null }
  }
}

export const fetchDayLoginState = async (uid: string, dateKey: string): Promise<boolean> => {
  try {
    const snapshot = await getDoc(loginDayRef(uid, dateKey))
    return snapshot.exists()
  } catch {
    return false
  }
}

// All recorded login-day keys ("DD.MM.YYYY" doc ids) — used to find the earliest
// day the range navigation may reach.
export const fetchLoginDayKeys = async (uid: string): Promise<string[]> => {
  try {
    const snapshot = await getDocs(collection(doc(db, 'users', uid), 'loginDays'))
    return snapshot.docs.map((entry) => entry.id)
  } catch {
    return []
  }
}

// The account's createdAt (ISO string or Firestore Timestamp), time-stripped.
export const fetchUserCreatedAt = async (uid: string): Promise<Date | null> => {
  try {
    const snapshot = await getDoc(doc(db, 'users', uid))
    if (!snapshot.exists()) return null
    const raw = snapshot.data().createdAt
    if (!raw) return null
    if (typeof raw === 'object' && 'toDate' in raw && typeof raw.toDate === 'function') {
      return stripTime(raw.toDate())
    }
    const date = new Date(raw)
    return Number.isNaN(date.getTime()) ? null : stripTime(date)
  } catch {
    return null
  }
}
