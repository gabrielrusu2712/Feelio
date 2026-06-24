export type DiaryStatus = 'idle' | 'loading' | 'saving' | 'ready' | 'error'

export interface DiaryEntry {
  id: string
  entry: string
  question: string
  mood: string
  moodEmoji: string
  createdAt: string
}

export interface DiaryState {
  entries: DiaryEntry[]
  status: DiaryStatus
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
  error: string | null
}
