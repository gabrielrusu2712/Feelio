import { useTranslation } from 'react-i18next'
import { CONTENT_VIEWS } from '@/shared/data-access/constants/content-views'
import type { ContentViewKey } from '@/shared/data-access/constants/content-views'
import PageMenu from '@/shared/ui/page-menu/page-menu'
import {
  CollapseToggle,
  ContentBody,
  ContentHeader,
  ContentRoot,
  HeaderTitle,
} from '@/shared/features/app-layout/panels/content-panel.styled'

interface ContentPanelProps {
  view: ContentViewKey
  onViewChange: (view: ContentViewKey) => void
  collapsible?: boolean
  collapsed?: boolean
  onToggleCollapse?: () => void
}

const ContentPanel = (props: ContentPanelProps) => {
  const { view, onViewChange, collapsible = false, collapsed = false, onToggleCollapse } = props
  const { t } = useTranslation()

  const items = CONTENT_VIEWS.map((entry) => ({
    key: entry.key,
    label: t(entry.labelKey, { defaultValue: entry.key }),
  }))
  const activeLabel = items.find((item) => item.key === view)?.label ?? ''

  return (
    <ContentRoot>
      <ContentHeader>
        <PageMenu
          items={items}
          active={view}
          onSelect={(key) => onViewChange(key as ContentViewKey)}
          ariaLabel={t('shell.menu.open')}
        />
        <HeaderTitle>{activeLabel}</HeaderTitle>
        {collapsible && (
          <CollapseToggle
            type="button"
            onClick={onToggleCollapse}
            aria-label={t(collapsed ? 'shell.expand' : 'shell.collapse')}
          >
            {collapsed ? '▸' : '▾'}
          </CollapseToggle>
        )}
      </ContentHeader>

      {!collapsed && (
        <ContentBody>{t('shell.content.placeholder', { view: activeLabel })}</ContentBody>
      )}
    </ContentRoot>
  )
}

export default ContentPanel
