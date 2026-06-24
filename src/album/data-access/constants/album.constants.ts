export const ALBUM_PENDING_CLAIM_KEY = 'feelio_pending_location_claim'
export const ALBUM_DAILY_MAX_REWARDS = 3
export const ALBUM_MAX_ENTRIES = 40
export const USERS_COLLECTION = 'users'
export const ALBUM_ENTRIES_COLLECTION = 'albumEntries'
export const LOCATION_REWARDS_COLLECTION = 'locationRewards'

export interface PendingClaim {
  placeKey: string
  placeName: string
  stars: number
}

export const readPendingClaim = (): PendingClaim | null => {
  try {
    const raw = localStorage.getItem(ALBUM_PENDING_CLAIM_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PendingClaim
  } catch {
    return null
  }
}

export const clearPendingClaim = (): void => {
  localStorage.removeItem(ALBUM_PENDING_CLAIM_KEY)
}
