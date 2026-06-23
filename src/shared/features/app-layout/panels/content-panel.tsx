import { useTranslation } from 'react-i18next'
import { CONTENT_VIEWS } from '@/shared/data-access/constants/content-views'
import type { ActiveView } from '@/shared/data-access/constants/content-views'
import PageMenu from '@/shared/ui/page-menu/page-menu'
import HomeNavMenu from '@/shared/ui/home-nav-menu/home-nav-menu'
import {
  ContentBody,
  ContentHeader,
  ContentRoot,
  HeaderTitle,
} from '@/shared/features/app-layout/panels/content-panel.styled'

interface ContentPanelProps {
  active: ActiveView
  onSelect: (target: ActiveView) => void
}

// Landscape content panel. On Home it becomes a big navigation board filling
// the panel (forcing the user to pick a destination); on any other route it
// shows that view behind the compact "…" menu, which also offers Home so the
// board stays reachable.
const ContentPanel = (props: ContentPanelProps) => {
  const { active, onSelect } = props
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
        />
      </ContentRoot>
    )
  }

  const menuItems = [{ key: 'home', label: t('shell.menu.home') }, ...destinations]
  const activeLabel = menuItems.find((item) => item.key === active)?.label ?? ''

  return (
    <ContentRoot>
      <ContentHeader>
        <PageMenu
          items={menuItems}
          active={active}
          onSelect={(key) => onSelect(key as ActiveView)}
          ariaLabel={t('shell.menu.open')}
        />
        <HeaderTitle>{activeLabel}</HeaderTitle>
      </ContentHeader>

      <ContentBody>{t('shell.content.placeholder', { view: activeLabel })}</ContentBody>
    </ContentRoot>
  )
}

export default ContentPanel
