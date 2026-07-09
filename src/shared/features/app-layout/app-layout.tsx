import { useState } from 'react'
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

  return (
    <Shell>
      <TopBar />

      {mode === 'desktop' ? (
        <DesktopShell active={active} onSelect={onSelect} onOpenSettings={onOpenSettings} />
      ) : (
        <MobileShell active={active} onSelect={onSelect} onOpenSettings={onOpenSettings} />
      )}

      {settingsOpen && <SettingsOverlay onClose={() => setSettingsOpen(false)} />}
    </Shell>
  )
}

export default AppLayout
