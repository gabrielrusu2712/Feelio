import { useTranslation } from 'react-i18next'
import { CONTENT_VIEWS } from '@/shared/data-access/constants/content-views'
import type { ActiveView } from '@/shared/data-access/constants/content-views'
import PageMenu from '@/shared/ui/page-menu/page-menu'
import HomeNavMenu from '@/shared/ui/home-nav-menu/home-nav-menu'
import SettingsButton from '@/shared/ui/settings-button/settings-button'
import DiaryPage from '@/diary/features/diary-page/diary-page'
import MapPage from '@/map/features/map-page/map-page'
import AlbumPage from '@/album/features/album-page/album-page'
import WellbeingPage from '@/wellbeing/features/wellbeing-page/wellbeing-page'
import StatisticsPage from '@/statistics/features/statistics-page/statistics-page'
import ChatPage from '@/chat/features/chat-page/chat-page'
import GamePage from '@/game/features/game-page/game-page'
import {
  ContentBody,
  ContentHeader,
  ContentRoot,
  HeaderTitle,
} from '@/shared/features/app-layout/panels/content-panel.styled'

interface ContentPanelProps {
  active: ActiveView
  onSelect: (target: ActiveView) => void
  onOpenSettings: () => void
  /** Fullscreen game: hide this panel's chrome and let the game fill everything. */
  expanded: boolean
  onToggleExpand: () => void
}

// Landscape content panel. On Home it becomes a big navigation board filling
// the panel (forcing the user to pick a destination); on any other route it
// shows that view behind the compact "…" menu, which also offers Home so the
// board stays reachable.
const ContentPanel = (props: ContentPanelProps) => {
  const { active, onSelect, onOpenSettings, expanded, onToggleExpand } = props
  const { t } = useTranslation()

  const destinations = CONTENT_VIEWS.map((entry) => ({
    key: entry.key,
    label: t(entry.labelKey, { defaultValue: entry.key }),
    icon: entry.icon,
  }))

  if (active === 'home') {
    return (
      <ContentRoot>
        <HomeNavMenu
          title={t('shell.menu.title')}
          items={destinations}
          onSelect={(key) => onSelect(key as ActiveView)}
          onOpenSettings={onOpenSettings}
        />
      </ContentRoot>
    )
  }

  const menuItems = [{ key: 'home', label: t('shell.menu.home') }, ...destinations]
  const activeLabel = menuItems.find((item) => item.key === active)?.label ?? ''

  return (
    <ContentRoot $expanded={expanded}>
      <ContentHeader $hidden={expanded}>
        <PageMenu
          items={menuItems}
          active={active}
          onSelect={(key) => onSelect(key as ActiveView)}
          ariaLabel={t('shell.menu.open')}
        />
        <HeaderTitle>{activeLabel}</HeaderTitle>
        <SettingsButton onClick={onOpenSettings} />
      </ContentHeader>

      <ContentBody
        $noPadding={
          active === 'journal' ||
          active === 'explore' ||
          active === 'album' ||
          active === 'challenges' ||
          active === 'stats' ||
          active === 'conversation' ||
          active === 'game'
        }
      >
        {active === 'journal' ? (
          <DiaryPage />
        ) : active === 'explore' ? (
          <MapPage />
        ) : active === 'album' ? (
          <AlbumPage />
        ) : active === 'challenges' ? (
          <WellbeingPage />
        ) : active === 'stats' ? (
          <StatisticsPage />
        ) : active === 'conversation' ? (
          <ChatPage />
        ) : active === 'game' ? (
          <GamePage expanded={expanded} onToggleExpand={onToggleExpand} />
        ) : (
          t('shell.content.placeholder', { view: activeLabel })
        )}
      </ContentBody>
    </ContentRoot>
  )
}

export default ContentPanel
