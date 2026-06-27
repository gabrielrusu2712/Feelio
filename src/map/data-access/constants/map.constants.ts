export const MAP_CATEGORIES = ['all', 'nature', 'water', 'culture'] as const
export type MapCategory = (typeof MAP_CATEGORIES)[number]

export const CATEGORY_LABEL_KEYS = {
  all: 'map.filter.all',
  nature: 'map.filter.nature',
  water: 'map.filter.water',
  culture: 'map.filter.culture',
} as const satisfies Record<MapCategory, string>

export const LOCATIONS_COLLECTION = 'locations'

// Default center: Galați, Romania (matches source)
export const DEFAULT_MAP_CENTER: [number, number] = [45.43, 28.03]
export const DEFAULT_MAP_ZOOM = 14

// Check-in distance threshold in metres
export const CHECKIN_DISTANCE_METERS = 200

export const TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

// Leaflet markers are drawn imperatively (outside styled-components), so their
// colours can't read the theme. Mirror the brand tokens here as the single
// source of truth instead of scattering hex literals through the hook.
// (terracotta = brand.500, white = marker stroke, blue = the user's location.)
export const MARKER_COLORS = {
  objectiveFill: '#C44A3A',
  objectiveStroke: '#FFFFFF',
  userFill: '#3498DB',
  userStroke: '#FFFFFF',
} as const
