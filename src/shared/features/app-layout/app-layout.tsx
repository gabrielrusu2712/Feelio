import { useState } from 'react'
import { useLayoutMode } from '@/shared/data-access/hooks/use-layout-mode'
import TopBar from '@/shared/features/top-bar/top-bar'
import DesktopShell from '@/shared/features/app-layout/desktop-shell'
import MobileShell from '@/shared/features/app-layout/mobile-shell'
import SettingsOverlay from '@/shared/features/settings-overlay/settings-overlay'
import { DEFAULT_CONTENT_VIEW } from '@/shared/data-access/constants/content-views'
import type { ContentViewKey } from '@/shared/data-access/constants/content-views'
import { Shell } from '@/shared/features/app-layout/app-layout.styled'

// The authenticated shell (AuthGuard layout element). Picks an adaptive layout
// by orientation: landscape → desktop 3-panel, portrait → mobile stacked.
const AppLayout = () => {
  const mode = useLayoutMode()
  const [view, setView] = useState<ContentViewKey>(DEFAULT_CONTENT_VIEW)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <Shell>
      <TopBar onOpenSettings={() => setSettingsOpen(true)} />

      {mode === 'desktop' ? <DesktopShell view={view} onViewChange={setView} /> : <MobileShell />}

      {settingsOpen && <SettingsOverlay onClose={() => setSettingsOpen(false)} />}
    </Shell>
  )
}

export default AppLayout
