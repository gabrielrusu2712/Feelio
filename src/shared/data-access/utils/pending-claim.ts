// The map→album hand-off contract. The map writes a pending claim on a
// successful check-in; the album reads it to award a photo upload, then clears
// it. Shared because it is the single source of truth for two domains.

import {
  STORAGE_KEYS,
  getItem,
  removeItem,
  setItem,
} from '@/shared/data-access/utils/local-storage'

export interface PendingClaim {
  placeKey: string
  placeName: string
  stars: number
}

export const writePendingClaim = (claim: PendingClaim): void => {
  setItem(STORAGE_KEYS.PENDING_CLAIM, claim)
}

export const readPendingClaim = (): PendingClaim | null =>
  getItem<PendingClaim>(STORAGE_KEYS.PENDING_CLAIM)

export const clearPendingClaim = (): void => {
  removeItem(STORAGE_KEYS.PENDING_CLAIM)
}
