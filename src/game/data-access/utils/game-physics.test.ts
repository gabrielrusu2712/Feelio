import { describe, expect, it } from 'vitest'
import { clamp, computeSpeed, intersects } from '@/game/data-access/utils/game-physics'

describe('intersects', () => {
  it('detects overlapping boxes', () => {
    const a = { x: 0, y: 0, w: 50, h: 50 }
    const b = { x: 20, y: 20, w: 50, h: 50 }

    expect(intersects(a, b, 0)).toBe(true)
  })

  it('reports no overlap for separated boxes', () => {
    const a = { x: 0, y: 0, w: 50, h: 50 }
    const b = { x: 200, y: 200, w: 50, h: 50 }

    expect(intersects(a, b, 0)).toBe(false)
  })

  it('shrinks the effective hitbox by the inset', () => {
    const a = { x: 0, y: 0, w: 50, h: 50 }
    const b = { x: 45, y: 0, w: 50, h: 50 }

    expect(intersects(a, b, 0)).toBe(true)
    expect(intersects(a, b, 15)).toBe(false)
  })
})

describe('computeSpeed', () => {
  it('returns the base speed with no score', () => {
    expect(computeSpeed(0, 7, 150)).toBe(7)
  })

  it('steps up by one per full divisor of score', () => {
    expect(computeSpeed(149, 7, 150)).toBe(7)
    expect(computeSpeed(150, 7, 150)).toBe(8)
    expect(computeSpeed(320, 7, 150)).toBe(9)
  })
})

describe('clamp', () => {
  it('keeps values within range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-5, 0, 10)).toBe(0)
    expect(clamp(15, 0, 10)).toBe(10)
  })
})
