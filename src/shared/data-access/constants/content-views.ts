// The switchable views the content area can show. Each is a placeholder for
// now; the real screens are built in their own migration phases. Order here is
// the order shown in the "…" page menu.

export type ContentViewKey = 'stats' | 'explore' | 'album' | 'journal' | 'game' | 'challenges'

interface ContentView {
  key: ContentViewKey
  labelKey: string
}

export const CONTENT_VIEWS: ContentView[] = [
  { key: 'stats', labelKey: 'shell.content.stats' },
  { key: 'explore', labelKey: 'shell.content.explore' },
  { key: 'album', labelKey: 'shell.content.album' },
  { key: 'journal', labelKey: 'shell.content.journal' },
  { key: 'game', labelKey: 'shell.content.game' },
  { key: 'challenges', labelKey: 'shell.content.challenges' },
]

export const DEFAULT_CONTENT_VIEW: ContentViewKey = 'stats'
