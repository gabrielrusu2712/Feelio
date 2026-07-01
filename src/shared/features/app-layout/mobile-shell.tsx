import { useTranslation } from 'react-i18next'
import PageMenu from '@/shared/ui/page-menu/page-menu'
import { CONTENT_VIEWS } from '@/shared/data-access/constants/content-views'
import type { ActiveView } from '@/shared/data-access/constants/content-views'
import HomeScreen from '@/shared/features/app-layout/panels/home-screen'
import DiaryPage from '@/diary/features/diary-page/diary-page'
import MapPage from '@/map/features/map-page/map-page'
import AlbumPage from '@/album/features/album-page/album-page'
import WellbeingPage from '@/wellbeing/features/wellbeing-page/wellbeing-page'
import StatisticsPage from '@/statistics/features/statistics-page/statistics-page'
import {
  HeaderTitle,
  MobileBody,
  MobileHeader,
  MobilePanel,
  Placeholder,
} from '@/shared/features/app-layout/mobile-shell.styled'

interface MobileShellProps {
  active: ActiveView
  onSelect: (target: ActiveView) => void
}

// Portrait is one panel: the "…" menu (Home + content views) swaps the full
// page via the route. Home shows the bear over horizontal bars; the rest are
// placeholders.
const MobileShell = (props: MobileShellProps) => {
  const { active, onSelect } = props
  const { t } = useTranslation()

  const items = [
    { key: 'home', label: t('shell.menu.home') },
    ...CONTENT_VIEWS.map((entry) => ({
      key: entry.key,
      label: t(entry.labelKey, { defaultValue: entry.key }),
    })),
  ]
  const activeLabel = items.find((item) => item.key === active)?.label ?? ''

  return (
    <MobilePanel>
      <MobileHeader>
        <PageMenu
          items={items}
          active={active}
          onSelect={(key) => onSelect(key as ActiveView)}
          ariaLabel={t('shell.menu.open')}
        />
        <HeaderTitle>{activeLabel}</HeaderTitle>
      </MobileHeader>

      <MobileBody
        $fullHeight={
          active === 'journal' ||
          active === 'explore' ||
          active === 'album' ||
          active === 'challenges' ||
          active === 'stats'
        }
      >
        {active === 'home' ? (
          <HomeScreen />
        ) : active === 'journal' ? (
          <DiaryPage />
        ) : active === 'explore' ? (
          <MapPage />
        ) : active === 'album' ? (
          <AlbumPage />
        ) : active === 'challenges' ? (
          <WellbeingPage />
        ) : active === 'stats' ? (
          <StatisticsPage />
        ) : (
          <Placeholder>{t('shell.content.placeholder', { view: activeLabel })}</Placeholder>
        )}
      </MobileBody>
    </MobilePanel>
  )
}

export default MobileShell
