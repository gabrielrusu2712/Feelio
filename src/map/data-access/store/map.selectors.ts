import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/core/store/store'

const selectMap = (state: RootState) => state.map

export const selectMapStatus = (state: RootState) => selectMap(state).status

export const selectActiveCategory = (state: RootState) => selectMap(state).activeCategory

export const selectSearchQuery = (state: RootState) => selectMap(state).searchQuery

const selectObjectives = (state: RootState) => selectMap(state).objectives

// Inputs are the raw objectives + the two filters — NOT the whole `map` slice.
// Keying on the slice made this recompute (new array) on every unrelated map
// change, e.g. setSelectedLocation on popupopen, which rebuilt all markers and
// destroyed the just-opened popup (the "click twice to open" bug).
export const selectFilteredObjectives = createSelector(
  [selectObjectives, selectActiveCategory, selectSearchQuery],
  (objectives, activeCategory, searchQuery) =>
    objectives.filter((obj) => {
      const matchesCategory = activeCategory === 'all' || obj.category === activeCategory
      const matchesSearch =
        searchQuery === '' ||
        obj.name.ro.toLowerCase().includes(searchQuery) ||
        obj.name.en.toLowerCase().includes(searchQuery)
      return matchesCategory && matchesSearch
    }),
)
