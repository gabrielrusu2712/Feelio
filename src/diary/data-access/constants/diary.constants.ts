export const DIARY_QUESTION_KEYS = [
  'diary.question.1',
  'diary.question.2',
  'diary.question.3',
  'diary.question.4',
  'diary.question.5',
  'diary.question.6',
  'diary.question.7',
  'diary.question.8',
  'diary.question.9',
  'diary.question.10',
] as const

export const Moods = {
  EXCELLENT: { id: 'excelent', emoji: '🌟' },
  GOOD: { id: 'bine', emoji: '🙂' },
  NEUTRAL: { id: 'neutru', emoji: '😐' },
  SAD: { id: 'trist', emoji: '😔' },
  STRESSED: { id: 'stresat', emoji: '😫' },
} as const

export type MoodId = (typeof Moods)[keyof typeof Moods]['id']

export const MOOD_LIST = Object.values(Moods)

export const JOURNAL_COLLECTION = 'journal'
export const USERS_COLLECTION = 'users'
export const MAX_ENTRIES_LOADED = 10
