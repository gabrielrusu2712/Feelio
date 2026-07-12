import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/user/data-access/api/user.api', () => ({
  updateUserDocument: vi.fn().mockResolvedValue(undefined),
}))

import { setupStore } from '@/core/store'
import { updateUserDocument } from '@/user/data-access/api/user.api'
import { setUserData } from '@/user/data-access/store/user.slice'
import { awardSessionStarsThunk, spendStarsToPlayThunk } from '@/game/data-access/store/game.thunks'

const mockUpdate = vi.mocked(updateUserDocument)

const seedStars = (store: ReturnType<typeof setupStore>, totalStars: number) => {
  store.dispatch(
    setUserData({
      username: 'ana',
      lastUsernameChange: null,
      stats: { sleep: 0, water: 0, food: 0, sport: 0, wellbeing: 0 },
      totalDays: 1,
      xp: 0,
      playerLevel: 1,
      totalStars,
    }),
  )
}

const starsOf = (store: ReturnType<typeof setupStore>) => store.getState().user.totalStars

describe('spendStarsToPlayThunk', () => {
  beforeEach(() => {
    mockUpdate.mockReset()
    mockUpdate.mockResolvedValue(undefined)
  })

  it('deducts the cost and persists the new balance when affordable', async () => {
    const store = setupStore()
    seedStars(store, 25)

    const action = await store.dispatch(spendStarsToPlayThunk({ uid: 'u1', cost: 10 }))

    expect(spendStarsToPlayThunk.fulfilled.match(action)).toBe(true)
    expect(action.payload).toBe(true)
    expect(starsOf(store)).toBe(15)
    expect(mockUpdate).toHaveBeenCalledWith('u1', { totalStars: 15 })
  })

  it('does not spend or persist when the balance is too low', async () => {
    const store = setupStore()
    seedStars(store, 5)

    const action = await store.dispatch(spendStarsToPlayThunk({ uid: 'u1', cost: 10 }))

    expect(spendStarsToPlayThunk.fulfilled.match(action)).toBe(true)
    expect(action.payload).toBe(false)
    expect(starsOf(store)).toBe(5)
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('rolls the optimistic spend back when the write fails', async () => {
    const store = setupStore()
    seedStars(store, 25)
    mockUpdate.mockRejectedValueOnce(new Error('offline'))

    const action = await store.dispatch(spendStarsToPlayThunk({ uid: 'u1', cost: 10 }))

    expect(spendStarsToPlayThunk.rejected.match(action)).toBe(true)
    expect(starsOf(store)).toBe(25)
  })
})

describe('awardSessionStarsThunk', () => {
  beforeEach(() => {
    mockUpdate.mockReset()
    mockUpdate.mockResolvedValue(undefined)
  })

  it('credits the collected stars and persists the new balance', async () => {
    const store = setupStore()
    seedStars(store, 10)

    await store.dispatch(awardSessionStarsThunk({ uid: 'u1', stars: 5 }))

    expect(starsOf(store)).toBe(15)
    expect(mockUpdate).toHaveBeenCalledWith('u1', { totalStars: 15 })
  })

  it('is a no-op when no stars were collected', async () => {
    const store = setupStore()
    seedStars(store, 10)

    await store.dispatch(awardSessionStarsThunk({ uid: 'u1', stars: 0 }))

    expect(starsOf(store)).toBe(10)
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('rolls the optimistic payout back when the write fails', async () => {
    const store = setupStore()
    seedStars(store, 10)
    mockUpdate.mockRejectedValueOnce(new Error('offline'))

    const action = await store.dispatch(awardSessionStarsThunk({ uid: 'u1', stars: 5 }))

    expect(awardSessionStarsThunk.rejected.match(action)).toBe(true)
    expect(starsOf(store)).toBe(10)
  })
})
