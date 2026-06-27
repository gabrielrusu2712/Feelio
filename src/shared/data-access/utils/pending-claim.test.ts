import { afterEach, describe, expect, it } from 'vitest'
import {
  clearPendingClaim,
  readPendingClaim,
  writePendingClaim,
} from '@/shared/data-access/utils/pending-claim'

const claim = { placeKey: 'loc-1', placeName: 'Cetatea Alba Carolina', stars: 20 }

describe('pending-claim util', () => {
  afterEach(() => localStorage.clear())

  it('round-trips a written claim', () => {
    writePendingClaim(claim)

    expect(readPendingClaim()).toEqual(claim)
  })

  it('returns null when no claim is stored', () => {
    expect(readPendingClaim()).toBeNull()
  })

  it('removes the claim on clear', () => {
    writePendingClaim(claim)
    clearPendingClaim()

    expect(readPendingClaim()).toBeNull()
  })
})
