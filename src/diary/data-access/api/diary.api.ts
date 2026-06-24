import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/core/services/firebase'
import {
  JOURNAL_COLLECTION,
  MAX_ENTRIES_LOADED,
  USERS_COLLECTION,
} from '@/diary/data-access/constants/diary.constants'
import type { DiaryEntry } from '@/diary/data-access/store/diary.types'

export interface NewEntryPayload {
  entry: string
  question: string
  mood: string
  moodEmoji: string
}

const journalCollectionRef = (uid: string) =>
  collection(doc(collection(db, USERS_COLLECTION), uid), JOURNAL_COLLECTION)

export const saveJournalEntry = async (uid: string, payload: NewEntryPayload): Promise<string> => {
  const ref = await addDoc(journalCollectionRef(uid), {
    ...payload,
    createdAt: new Date().toISOString(),
    timestamp: serverTimestamp(),
  })
  return ref.id
}

export const fetchJournalEntries = async (uid: string): Promise<DiaryEntry[]> => {
  const q = query(
    journalCollectionRef(uid),
    orderBy('timestamp', 'desc'),
    limit(MAX_ENTRIES_LOADED),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      entry: data.entry ?? '',
      question: data.question ?? '',
      mood: data.mood ?? 'neutru',
      moodEmoji: data.moodEmoji ?? '😐',
      createdAt: data.createdAt ?? new Date().toISOString(),
    }
  })
}
