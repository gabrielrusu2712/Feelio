import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useLayoutMode } from '@/shared/data-access/hooks/use-layout-mode'
import TopBar from '@/shared/features/top-bar/top-bar'
import DesktopShell from '@/shared/features/app-layout/desktop-shell'
import MobileShell from '@/shared/features/app-layout/mobile-shell'
import SettingsOverlay from '@/shared/features/settings-overlay/settings-overlay'
import { pathForView, viewForPath } from '@/shared/data-access/constants/content-views'
import type { ActiveView } from '@/shared/data-access/constants/content-views'
import { Shell } from '@/shared/features/app-layout/app-layout.styled'

// The authenticated shell (layout element for every authed route). The route
// decides the active destination; orientation decides the layout: landscape →
// desktop 3-panel, portrait → mobile stacked.
const AppLayout = () => {
  const mode = useLayoutMode()
  const location = useLocation()
  const navigate = useNavigate()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const active = viewForPath(location.pathname)
  const onSelect = (target: ActiveView) => navigate(pathForView(target))

  const onOpenSettings = () => setSettingsOpen(true)

  // Fullscreen game: only offered in the landscape (desktop) shell, on the game
  // view. The content panel grows to fill the whole shell and the other panels +
  // top bar collapse away. `fullscreen` is DERIVED (not reset via an effect) so
  // navigating off the game or rotating to portrait drops back to the normal
  // layout automatically, without a forbidden in-effect setState.
  const [expanded, setExpanded] = useState(false)
  const canExpand = mode === 'desktop' && active === 'game'
  const fullscreen = canExpand && expanded

  // Escape leaves fullscreen (the in-game toggle only lives on the start screen).
  useEffect(() => {
    if (!fullscreen) return undefined
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fullscreen])

  const onToggleExpand = () => setExpanded((value) => !value)

  return (
    <Shell>
      <TopBar hidden={fullscreen} />

      {mode === 'desktop' ? (
        <DesktopShell
          active={active}
          onSelect={onSelect}
          onOpenSettings={onOpenSettings}
          expanded={fullscreen}
          onToggleExpand={onToggleExpand}
        />
      ) : (
        <MobileShell active={active} onSelect={onSelect} onOpenSettings={onOpenSettings} />
      )}

      {settingsOpen && <SettingsOverlay onClose={() => setSettingsOpen(false)} />}
    </Shell>
  )
}

export default AppLayout
