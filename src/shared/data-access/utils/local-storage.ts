// Typed, fail-safe localStorage access + the registry of app-owned keys.
// Lives in shared/ because persistence is read/written across domains.

export const STORAGE_KEYS = {
  /** Persisted UI language — managed via the i18n custom detector. */
  LANGUAGE: 'feelio_lang',
  /** redux-persist key for the user slice (stats mirror / totalStars / username). */
  USER: 'feelio_user',
  /** Settings backdrop blur strength (px). */
  BLUR: 'feelio_blur',
  /** Desktop panel order (character/bars/content). */
  PANEL_ORDER: 'feelio_panel_order',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

// Reads and JSON-parses a value; returns null on miss, parse error, or when
// storage is unavailable (private mode / SSR), so callers never need try/catch.
export const getItem = <T>(key: StorageKey): T | null => {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? null : (JSON.parse(raw) as T)
  } catch {
    return null
  }
}

export const setItem = <T>(key: StorageKey, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable or over quota — non-fatal.
  }
}
