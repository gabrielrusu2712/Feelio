import { describe, expect, it } from 'vitest'
import { toDateKey } from '@/user/data-access/utils/date-key'

describe('toDateKey', () => {
  it('formats a date with the ro-RO locale (dd.mm.yyyy)', () => {
    expect(toDateKey(new Date('2026-05-15T10:00:00Z'))).toBe('15.05.2026')
  })

  it('is stable across the same calendar day regardless of time', () => {
    const morning = toDateKey(new Date('2026-01-02T06:30:00'))
    const evening = toDateKey(new Date('2026-01-02T22:45:00'))

    expect(morning).toBe(evening)
  })

  it('produces different keys for different days', () => {
    expect(toDateKey(new Date('2026-01-02T12:00:00'))).not.toBe(
      toDateKey(new Date('2026-01-03T12:00:00')),
    )
  })
})
