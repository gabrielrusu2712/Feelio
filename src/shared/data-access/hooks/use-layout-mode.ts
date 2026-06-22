import { useSyncExternalStore } from 'react'

// Orientation-driven, NOT a width breakpoint: landscape (desktop, or a rotated
// phone) gets the 3-panel desktop shell; portrait gets the stacked mobile shell.
export type LayoutMode = 'desktop' | 'mobile'

const PORTRAIT_QUERY = '(orientation: portrait)'

const getSnapshot = (): LayoutMode =>
  window.matchMedia(PORTRAIT_QUERY).matches ? 'mobile' : 'desktop'

const subscribe = (onChange: () => void): (() => void) => {
  const query = window.matchMedia(PORTRAIT_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

export const useLayoutMode = (): LayoutMode =>
  useSyncExternalStore(subscribe, getSnapshot, () => 'desktop')
