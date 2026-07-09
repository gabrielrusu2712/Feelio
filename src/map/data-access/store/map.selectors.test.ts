import { describe, expect, it } from 'vitest'
import {
  selectActiveCategory,
  selectFilteredObjectives,
  selectMapStatus,
  selectSearchQuery,
} from '@/map/data-access/store/map.selectors'
import type { MapCategory } from '@/map/data-access/constants/map.constants'
import type { MapObjective, MapState } from '@/map/data-access/store/map.types'
import type { RootState } from '@/core/store/store'

const makeObjective = (
  id: string,
  category: MapCategory,
  ro: string,
  en: string,
): MapObjective => ({
  id,
  name: { ro, en },
  coords: [0, 0],
  category,
  desc: { ro: '', en: '' },
  stars: 10,
  image: '/assets/character/neutral.png',
})

const objectives: MapObjective[] = [
  makeObjective('park', 'nature', 'Parcul Mare', 'Big Park'),
  makeObjective('lake', 'water', 'Lacul Albastru', 'Blue Lake'),
  makeObjective('museum', 'culture', 'Muzeul de Artă', 'Art Museum'),
]

const stateWith = (overrides: Partial<MapState>): RootState =>
  ({
    map: {
      objectives,
      status: 'ready',
      error: null,
      activeCategory: 'all',
      searchQuery: '',
      selectedLocation: null,
      ...overrides,
    },
  }) as unknown as RootState

describe('map selectors', () => {
  it('exposes status, category and query', () => {
    const state = stateWith({ status: 'loading', activeCategory: 'water', searchQuery: 'lac' })

    expect(selectMapStatus(state)).toBe('loading')
    expect(selectActiveCategory(state)).toBe('water')
    expect(selectSearchQuery(state)).toBe('lac')
  })

  it('returns all objectives when category is "all" and query is empty', () => {
    expect(selectFilteredObjectives(stateWith({}))).toHaveLength(3)
  })

  it('filters by category', () => {
    const result = selectFilteredObjectives(stateWith({ activeCategory: 'culture' }))

    expect(result.map((o) => o.id)).toEqual(['museum'])
  })

  it('filters by search query across both languages', () => {
    expect(selectFilteredObjectives(stateWith({ searchQuery: 'lacul' })).map((o) => o.id)).toEqual([
      'lake',
    ])
    expect(selectFilteredObjectives(stateWith({ searchQuery: 'museum' })).map((o) => o.id)).toEqual(
      ['museum'],
    )
  })

  it('combines category and search filters', () => {
    const result = selectFilteredObjectives(
      stateWith({ activeCategory: 'nature', searchQuery: 'park' }),
    )

    expect(result.map((o) => o.id)).toEqual(['park'])
  })
})
