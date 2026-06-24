import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { loadLocationsThunk } from '@/map/data-access/store/map.thunks'
import type { MapCategory } from '@/map/data-access/constants/map.constants'
import type { MapObjective, MapState } from '@/map/data-access/store/map.types'

const initialState: MapState = {
  objectives: [],
  status: 'idle',
  error: null,
  activeCategory: 'all',
  searchQuery: '',
  selectedLocation: null,
}

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<MapCategory>) => {
      state.activeCategory = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload.toLowerCase().trim()
    },
    setSelectedLocation: (state, action: PayloadAction<MapObjective | null>) => {
      state.selectedLocation = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLocationsThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadLocationsThunk.fulfilled, (state, action) => {
        state.status = 'ready'
        state.objectives = action.payload
      })
      .addCase(loadLocationsThunk.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload ?? action.error.message ?? 'map.error.loadFailed'
      })
  },
})

export const { setCategory, setSearchQuery, setSelectedLocation } = mapSlice.actions

export default mapSlice.reducer
