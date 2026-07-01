import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/core/store'
import {
  selectPlayerLevel,
  selectTotalDays,
  selectTotalStars,
  selectUsername,
  selectXp,
  XP_PER_LEVEL,
} from '@/user/data-access/store'
import LevelRing from '@/shared/ui/level-ring/level-ring'
import {
  Bar,
  DayCounter,
  Identity,
  SettingsButton,
  StarIcon,
  Stars,
} from '@/shared/features/top-bar/top-bar.styled'

interface TopBarProps {
  onOpenSettings: () => void
}

const TopBar = (props: TopBarProps) => {
  const { onOpenSettings } = props
  const { t } = useTranslation()
  const username = useAppSelector(selectUsername)
  const totalDays = useAppSelector(selectTotalDays)
  const totalStars = useAppSelector(selectTotalStars)
  const xp = useAppSelector(selectXp)
  const level = useAppSelector(selectPlayerLevel)

  // The ring fills with progress toward the next level (XP earned by completing
  // wellbeing challenges); leveling up grants the stars spent on the game.
  const progress = Math.round((xp / XP_PER_LEVEL) * 100)

  return (
    <Bar>
      <Identity>
        <LevelRing level={level} progress={progress} />
        <span>{username ?? '—'}</span>
      </Identity>
      <Stars>
        <StarIcon src="/assets/shared/star.png" alt="" aria-hidden />
        <span aria-label={t('shell.topbar.stars', { count: totalStars })}>{totalStars}</span>
      </Stars>
      <DayCounter>{t('shell.topbar.day', { day: totalDays })}</DayCounter>
      <SettingsButton type="button" onClick={onOpenSettings} aria-label={t('settings.open')}>
        ⚙
      </SettingsButton>
    </Bar>
  )
}

export default TopBar
