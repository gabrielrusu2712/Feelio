import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchJournalEntries, saveJournalEntry } from '@/diary/data-access/api/diary.api'
import type { NewEntryPayload } from '@/diary/data-access/api/diary.api'
import type { DiaryEntry } from '@/diary/data-access/store/diary.types'

interface LoadEntriesArgs {
  uid: string
}

interface SaveEntryArgs {
  uid: string
  payload: NewEntryPayload
}

export const loadEntriesThunk = createAsyncThunk<
  DiaryEntry[],
  LoadEntriesArgs,
  { rejectValue: string }
>('diary/loadEntries', async (args, { rejectWithValue }) => {
  try {
    return await fetchJournalEntries(args.uid)
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'diary.error.loadFailed')
  }
})

export const saveEntryThunk = createAsyncThunk<DiaryEntry, SaveEntryArgs, { rejectValue: string }>(
  'diary/saveEntry',
  async (args, { rejectWithValue }) => {
    try {
      const id = await saveJournalEntry(args.uid, args.payload)
      return {
        id,
        ...args.payload,
        createdAt: new Date().toISOString(),
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'diary.error.saveFailed')
    }
  },
)
