import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/core/store/store'

const selectMap = (state: RootState) => state.map

export const selectMapStatus = (state: RootState) => selectMap(state).status

export const selectActiveCategory = (state: RootState) => selectMap(state).activeCategory

export const selectSearchQuery = (state: RootState) => selectMap(state).searchQuery

export const selectFilteredObjectives = createSelector(selectMap, (map) => {
  const { objectives, activeCategory, searchQuery } = map
  return objectives.filter((obj) => {
    const matchesCategory = activeCategory === 'all' || obj.category === activeCategory
    const matchesSearch =
      searchQuery === '' ||
      obj.name.ro.toLowerCase().includes(searchQuery) ||
      obj.name.en.toLowerCase().includes(searchQuery)
    return matchesCategory && matchesSearch
  })
})
