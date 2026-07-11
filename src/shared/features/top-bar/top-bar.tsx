import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/core/store'
import { selectTotalDays } from '@/user/data-access/store'
import { Bar, DayCounter } from '@/shared/features/top-bar/top-bar.styled'

interface TopBarProps {
  /** Collapse the bar away (used when the game goes fullscreen). */
  hidden?: boolean
}

const TopBar = (props: TopBarProps) => {
  const { hidden = false } = props
  const { t } = useTranslation()
  const totalDays = useAppSelector(selectTotalDays)

  return (
    <Bar $hidden={hidden}>
      <DayCounter>{t('shell.topbar.day', { day: totalDays })}</DayCounter>
    </Bar>
  )
}

export default TopBar
