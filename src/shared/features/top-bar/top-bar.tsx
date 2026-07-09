import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/core/store'
import { selectTotalDays } from '@/user/data-access/store'
import { Bar, DayCounter } from '@/shared/features/top-bar/top-bar.styled'

const TopBar = () => {
  const { t } = useTranslation()
  const totalDays = useAppSelector(selectTotalDays)

  return (
    <Bar>
      <DayCounter>{t('shell.topbar.day', { day: totalDays })}</DayCounter>
    </Bar>
  )
}

export default TopBar
