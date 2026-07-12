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
  // ISO string of the last username change (null = never changed / new account),
  // read by the settings rename UI to compute the 30-day cooldown.
  lastUsernameChange: string | null
  stats: Stats
  totalDays: number
  // The "player" economy lives here (this slice IS the shared player state that
  // the level ring and the game both read): xp counts toward the next level,
  // playerLevel is the overall level, totalStars is the game currency granted on
  // level-up. Cross-slice award orchestration happens in the smart handler, not
  // in a reducer — only the pure xp→level→stars math (awardXp) lives here.
  xp: number
  playerLevel: number
  totalStars: number
  status: UserDataStatus
  error: string | null
}

// Normalized per-user profile read into Redux. Never holds a firebase.User or a
// Firestore Timestamp — the api layer maps those to plain primitives.
export interface UserProfile {
  username: string
  lastUsernameChange: string | null
  stats: Stats
  totalDays: number
  xp: number
  playerLevel: number
  totalStars: number
}
