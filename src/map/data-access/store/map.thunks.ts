import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchLocations } from '@/map/data-access/api/map.api'
import type { MapObjective } from '@/map/data-access/store/map.types'

export const loadLocationsThunk = createAsyncThunk<MapObjective[], void, { rejectValue: string }>(
  'map/loadLocations',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchLocations()
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'map.error.loadFailed')
    }
  },
)
