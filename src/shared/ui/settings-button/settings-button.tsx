import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/settings-button/settings-button.styled'

interface SettingsButtonProps {
  onClick: () => void
}

// The gear icon that opens the settings overlay. Rendered at the right edge
// of every page's title/menu row so it's reachable from anywhere in the app.
const SettingsButton = (props: SettingsButtonProps) => {
  const { onClick } = props
  const { t } = useTranslation()

  return (
    <Button type="button" onClick={onClick} aria-label={t('settings.open')}>
      ⚙
    </Button>
  )
}

export default SettingsButton
