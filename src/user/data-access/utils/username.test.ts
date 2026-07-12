import { describe, expect, it } from 'vitest'
import {
  normalizeUsername,
  seedUsername,
  validateUsername,
} from '@/user/data-access/utils/username'

describe('normalizeUsername', () => {
  it('lowercases, trims and drops invalid characters', () => {
    expect(normalizeUsername('  Ana Maria!  ')).toBe('anamaria')
    expect(normalizeUsername('John_Doe99')).toBe('john_doe99')
  })

  it('collapses casing so two variants share a reservation key', () => {
    expect(normalizeUsername('ANA')).toBe(normalizeUsername('ana'))
  })
})

describe('validateUsername', () => {
  it('accepts a well-formed name', () => {
    expect(validateUsername('ana_maria')).toBeNull()
  })

  it('rejects a too-short name (measured after normalization)', () => {
    expect(validateUsername('a!')).toBe('user.error.usernameTooShort')
  })

  it('rejects a too-long name', () => {
    expect(validateUsername('a'.repeat(21))).toBe('user.error.usernameTooLong')
  })
})

describe('seedUsername', () => {
  it('normalizes an email local-part into a valid base', () => {
    expect(seedUsername('Ana.Maria')).toBe('anamaria')
  })

  it('falls back to feelio when nothing usable survives', () => {
    expect(seedUsername('!!')).toBe('feelio')
  })

  it('caps the seed at the max length', () => {
    expect(seedUsername('a'.repeat(40)).length).toBe(20)
  })
})
