import { describe, expect, it } from 'vitest'
import mapReducer, {
  setCategory,
  setSearchQuery,
  setSelectedLocation,
} from '@/map/data-access/store/map.slice'
import { loadLocationsThunk } from '@/map/data-access/store/map.thunks'
import type { MapObjective, MapState } from '@/map/data-access/store/map.types'

const baseState: MapState = {
  objectives: [],
  status: 'idle',
  error: null,
  activeCategory: 'all',
  searchQuery: '',
  selectedLocation: null,
}

const objective: MapObjective = {
  id: 'loc-1',
  name: { ro: 'Cetatea', en: 'Citadel' },
  coords: [45.43, 28.03],
  category: 'culture',
  desc: { ro: '', en: '' },
  stars: 20,
  image: '/neutral.png',
}

describe('map slice', () => {
  it('starts idle with the default filters', () => {
    expect(mapReducer(undefined, { type: '@@INIT' })).toEqual(baseState)
  })

  it('sets the active category', () => {
    const state = mapReducer(baseState, setCategory('nature'))

    expect(state.activeCategory).toBe('nature')
  })

  it('normalizes the search query to lower-case and trimmed', () => {
    const state = mapReducer(baseState, setSearchQuery('  Cetatea  '))

    expect(state.searchQuery).toBe('cetatea')
  })

  it('stores and clears the selected location', () => {
    const selected = mapReducer(baseState, setSelectedLocation(objective))
    expect(selected.selectedLocation).toEqual(objective)

    const cleared = mapReducer(selected, setSelectedLocation(null))
    expect(cleared.selectedLocation).toBeNull()
  })

  it('marks loading and clears any prior error on pending', () => {
    const failed: MapState = { ...baseState, status: 'error', error: 'map.error.loadFailed' }
    const state = mapReducer(failed, loadLocationsThunk.pending('req'))

    expect(state.status).toBe('loading')
    expect(state.error).toBeNull()
  })

  it('stores objectives on fulfilled', () => {
    const action = loadLocationsThunk.fulfilled([objective], 'req')
    const state = mapReducer(baseState, action)

    expect(state.status).toBe('ready')
    expect(state.objectives).toEqual([objective])
  })

  it('captures the rejected payload as the error', () => {
    const action = loadLocationsThunk.rejected(
      new Error('boom'),
      'req',
      undefined,
      'map.error.loadFailed',
    )
    const state = mapReducer(baseState, action)

    expect(state.status).toBe('error')
    expect(state.error).toBe('map.error.loadFailed')
  })
})
