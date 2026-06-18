import { describe, expect, it } from 'vitest'
import {
  canChangeUsername,
  daysUntilUsernameChange,
} from '@/user/data-access/utils/username-cooldown'

const now = new Date('2026-06-18T12:00:00Z')

const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

describe('daysUntilUsernameChange', () => {
  it('returns null when the username was never changed', () => {
    expect(daysUntilUsernameChange(null, now)).toBeNull()
  })

  it('returns null once 30 days have elapsed', () => {
    expect(daysUntilUsernameChange(daysAgo(30), now)).toBeNull()
    expect(daysUntilUsernameChange(daysAgo(45), now)).toBeNull()
  })

  it('rounds the remaining days up while inside the cooldown', () => {
    expect(daysUntilUsernameChange(daysAgo(10), now)).toBe(20)
    expect(daysUntilUsernameChange(daysAgo(29.2), now)).toBe(1)
  })
})

describe('canChangeUsername', () => {
  it('is true with no prior change and false inside the cooldown', () => {
    expect(canChangeUsername(null, now)).toBe(true)
    expect(canChangeUsername(daysAgo(5), now)).toBe(false)
    expect(canChangeUsername(daysAgo(31), now)).toBe(true)
  })
})
