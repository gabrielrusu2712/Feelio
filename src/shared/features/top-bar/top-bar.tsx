import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/core/store'
import { selectTotalDays, selectTotalStars, selectUsername } from '@/user/data-access/store'
import LevelRing from '@/shared/ui/level-ring/level-ring'
import { Bar, DayCounter, Identity, SettingsButton } from '@/shared/features/top-bar/top-bar.styled'

// Placeholder level math — the real XP/level economy lands in Phase 3.
const STARS_PER_LEVEL = 100

interface TopBarProps {
  onOpenSettings: () => void
}

const TopBar = (props: TopBarProps) => {
  const { onOpenSettings } = props
  const { t } = useTranslation()
  const username = useAppSelector(selectUsername)
  const totalDays = useAppSelector(selectTotalDays)
  const totalStars = useAppSelector(selectTotalStars)

  const level = Math.floor(totalStars / STARS_PER_LEVEL) + 1
  const progress = totalStars % STARS_PER_LEVEL

  return (
    <Bar>
      <Identity>
        <LevelRing level={level} progress={progress} />
        <span>{username ?? '—'}</span>
      </Identity>
      <DayCounter>{t('shell.topbar.day', { day: totalDays })}</DayCounter>
      <SettingsButton type="button" onClick={onOpenSettings} aria-label={t('settings.open')}>
        ⚙
      </SettingsButton>
    </Bar>
  )
}

export default TopBar
