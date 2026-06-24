export const MAP_CATEGORIES = ['all', 'nature', 'water', 'culture'] as const
export type MapCategory = (typeof MAP_CATEGORIES)[number]

export const CATEGORY_LABEL_KEYS: Record<MapCategory, string> = {
  all: 'map.filter.all',
  nature: 'map.filter.nature',
  water: 'map.filter.water',
  culture: 'map.filter.culture',
}

export const LOCATIONS_COLLECTION = 'locations'

// Default center: Galați, Romania (matches source)
export const DEFAULT_MAP_CENTER: [number, number] = [45.43, 28.03]
export const DEFAULT_MAP_ZOOM = 14

// Check-in distance threshold in metres
export const CHECKIN_DISTANCE_METERS = 200

export const TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
