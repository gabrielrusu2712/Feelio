import type { MapCategory } from '@/map/data-access/constants/map.constants'

export interface BilingualText {
  ro: string
  en: string
}

export interface MapObjective {
  id: string
  name: BilingualText
  coords: [number, number]
  category: string
  desc: BilingualText
  stars: number
  image: string
}

export type MapStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface MapState {
  objectives: MapObjective[]
  status: MapStatus
  error: string | null
  activeCategory: MapCategory
  searchQuery: string
  selectedLocation: MapObjective | null
}
