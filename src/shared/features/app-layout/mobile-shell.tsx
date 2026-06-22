import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageMenu from '@/shared/ui/page-menu/page-menu'
import { CONTENT_VIEWS } from '@/shared/data-access/constants/content-views'
import type { ContentViewKey } from '@/shared/data-access/constants/content-views'
import HomeScreen from '@/shared/features/app-layout/panels/home-screen'
import {
  HeaderTitle,
  MobileBody,
  MobileHeader,
  MobilePanel,
  Placeholder,
} from '@/shared/features/app-layout/mobile-shell.styled'

// Portrait is one panel: the "…" menu (Home + content views) swaps the full
// page. Home shows the bear over horizontal bars; the rest are placeholders.
type PortraitPage = 'home' | ContentViewKey

const MobileShell = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState<PortraitPage>('home')

  const items = [
    { key: 'home', label: t('shell.menu.home') },
    ...CONTENT_VIEWS.map((entry) => ({
      key: entry.key,
      label: t(entry.labelKey, { defaultValue: entry.key }),
    })),
  ]
  const activeLabel = items.find((item) => item.key === page)?.label ?? ''

  return (
    <MobilePanel>
      <MobileHeader>
        <PageMenu
          items={items}
          active={page}
          onSelect={(key) => setPage(key as PortraitPage)}
          ariaLabel={t('shell.menu.open')}
        />
        <HeaderTitle>{activeLabel}</HeaderTitle>
      </MobileHeader>

      <MobileBody>
        {page === 'home' ? (
          <HomeScreen />
        ) : (
          <Placeholder>{t('shell.content.placeholder', { view: activeLabel })}</Placeholder>
        )}
      </MobileBody>
    </MobilePanel>
  )
}

export default MobileShell
