// The switchable destinations the shell can show. Each is route-backed (a
// top-level path) and a placeholder for now; the real screens are built in
// their own migration phases. Order here is the order shown in the menus.

export type ContentViewKey =
  | 'stats'
  | 'explore'
  | 'album'
  | 'journal'
  | 'game'
  | 'challenges'
  | 'conversation'

// The active destination, including Home (the character/picker screen).
export type ActiveView = 'home' | ContentViewKey

interface ContentView {
  key: ContentViewKey
  /** Top-level route path this view is deep-linkable at. */
  path: string
  labelKey: string
  /** Emoji shown in the big landscape-home navigation board. */
  icon: string
}

export const HOME_PATH = '/home'

export const CONTENT_VIEWS: ContentView[] = [
  { key: 'stats', path: '/statistics', labelKey: 'shell.content.stats', icon: '📊' },
  { key: 'explore', path: '/explore', labelKey: 'shell.content.explore', icon: '🧭' },
  { key: 'album', path: '/album', labelKey: 'shell.content.album', icon: '📷' },
  { key: 'journal', path: '/journal', labelKey: 'shell.content.journal', icon: '📓' },
  { key: 'game', path: '/game', labelKey: 'shell.content.game', icon: '🎮' },
  { key: 'challenges', path: '/challenges', labelKey: 'shell.content.challenges', icon: '🏆' },
  {
    key: 'conversation',
    path: '/conversation',
    labelKey: 'shell.content.conversation',
    icon: '💬',
  },
]

// Every authed shell path, used to register the routes under AppLayout.
export const AUTHED_PATHS: string[] = [HOME_PATH, ...CONTENT_VIEWS.map((view) => view.path)]

const VIEW_BY_PATH = new Map<string, ContentViewKey>(
  CONTENT_VIEWS.map((view) => [view.path, view.key]),
)
const PATH_BY_KEY = new Map<ContentViewKey, string>(
  CONTENT_VIEWS.map((view) => [view.key, view.path]),
)

// URL → active view. Unknown paths (and /home) resolve to Home.
export const viewForPath = (pathname: string): ActiveView => VIEW_BY_PATH.get(pathname) ?? 'home'

// Active view → URL.
export const pathForView = (target: ActiveView): string =>
  target === 'home' ? HOME_PATH : (PATH_BY_KEY.get(target) ?? HOME_PATH)
