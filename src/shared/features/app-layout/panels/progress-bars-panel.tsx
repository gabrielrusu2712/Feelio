import { useTheme } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/core/store'
import { selectStats } from '@/user/data-access/store'
import VerticalStatBar from '@/shared/ui/vertical-stat-bar/vertical-stat-bar'
import { STAT_BARS, STAT_TARGETS, getStatAccents } from '@/shared/data-access/constants/stat-config'
import { BarsRoot } from '@/shared/features/app-layout/panels/progress-bars-panel.styled'

const ProgressBarsPanel = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const stats = useAppSelector(selectStats)
  const accents = getStatAccents(theme)

  return (
    <BarsRoot>
      {STAT_BARS.map((bar) => (
        <VerticalStatBar
          key={bar.key}
          value={stats[bar.key]}
          max={STAT_TARGETS[bar.key]}
          icon={bar.icon}
          label={t(bar.labelKey, { defaultValue: bar.key })}
          accent={accents[bar.key]}
        />
      ))}
    </BarsRoot>
  )
}

export default ProgressBarsPanel
