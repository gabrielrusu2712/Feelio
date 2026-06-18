export interface Stats {
  sleep: number
  water: number
  food: number
  sport: number
  wellbeing: number
}

export type UserDataStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface UserState {
  username: string | null
  stats: Stats
  totalDays: number
  totalStars: number
  status: UserDataStatus
  error: string | null
}

// Normalized per-user profile read into Redux. Never holds a firebase.User or a
// Firestore Timestamp — the api layer maps those to plain primitives.
export interface UserProfile {
  username: string
  stats: Stats
  totalDays: number
  totalStars: number
}
