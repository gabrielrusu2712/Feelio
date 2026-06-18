import { afterEach, describe, expect, it } from 'vitest'
import { STORAGE_KEYS, getItem, setItem } from '@/shared/data-access/utils/local-storage'

describe('local-storage util', () => {
  afterEach(() => localStorage.clear())

  it('round-trips a JSON-serializable value', () => {
    setItem(STORAGE_KEYS.USER, { stats: { sleep: 3 }, totalStars: 12 })

    expect(getItem(STORAGE_KEYS.USER)).toEqual({ stats: { sleep: 3 }, totalStars: 12 })
  })

  it('returns null for a missing key', () => {
    expect(getItem(STORAGE_KEYS.LANGUAGE)).toBeNull()
  })

  it('returns null instead of throwing on malformed JSON', () => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, '{not valid json')

    expect(getItem(STORAGE_KEYS.LANGUAGE)).toBeNull()
  })
})
