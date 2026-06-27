import { describe, expect, it } from 'vitest'
import diaryReducer, { resetSaveStatus } from '@/diary/data-access/store/diary.slice'
import { loadEntriesThunk, saveEntryThunk } from '@/diary/data-access/store/diary.thunks'
import type { DiaryEntry, DiaryState } from '@/diary/data-access/store/diary.types'

const baseState: DiaryState = {
  entries: [],
  status: 'idle',
  saveStatus: 'idle',
  error: null,
}

const entry: DiaryEntry = {
  id: 'e1',
  entry: 'Today was calm.',
  question: 'How do you feel?',
  mood: 'bine',
  moodEmoji: '🙂',
  createdAt: '2026-06-27T10:00:00.000Z',
}

const loadArgs = { uid: 'u1' }
const saveArgs = {
  uid: 'u1',
  payload: { entry: 'x', question: 'q', mood: 'bine', moodEmoji: '🙂' },
}

describe('diary slice', () => {
  it('starts idle and empty', () => {
    expect(diaryReducer(undefined, { type: '@@INIT' })).toEqual(baseState)
  })

  it('resets the save status to idle', () => {
    const saved: DiaryState = { ...baseState, saveStatus: 'saved' }

    expect(diaryReducer(saved, resetSaveStatus()).saveStatus).toBe('idle')
  })

  it('marks loading on load pending', () => {
    const state = diaryReducer(baseState, loadEntriesThunk.pending('req', loadArgs))

    expect(state.status).toBe('loading')
  })

  it('stores entries on load fulfilled', () => {
    const state = diaryReducer(baseState, loadEntriesThunk.fulfilled([entry], 'req', loadArgs))

    expect(state.status).toBe('ready')
    expect(state.entries).toEqual([entry])
  })

  it('marks saving on save pending', () => {
    const state = diaryReducer(baseState, saveEntryThunk.pending('req', saveArgs))

    expect(state.saveStatus).toBe('saving')
  })

  it('prepends the saved entry and marks saved on save fulfilled', () => {
    const existing: DiaryState = { ...baseState, entries: [entry] }
    const fresh: DiaryEntry = { ...entry, id: 'e2', entry: 'A new thought.' }
    const state = diaryReducer(existing, saveEntryThunk.fulfilled(fresh, 'req', saveArgs))

    expect(state.saveStatus).toBe('saved')
    expect(state.entries.map((e) => e.id)).toEqual(['e2', 'e1'])
  })

  it('captures the rejected payload as the error on save', () => {
    const action = saveEntryThunk.rejected(
      new Error('boom'),
      'req',
      saveArgs,
      'diary.error.saveFailed',
    )
    const state = diaryReducer(baseState, action)

    expect(state.saveStatus).toBe('error')
    expect(state.error).toBe('diary.error.saveFailed')
  })
})
