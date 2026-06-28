import { useTheme } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { STAT_TARGETS } from '@/user/data-access/store/user.constants'
import { useStatControls } from '@/shared/data-access/hooks/use-stat-controls'
import VerticalStatBar from '@/shared/ui/vertical-stat-bar/vertical-stat-bar'
import {
  STAT_BARS,
  STAT_FILL_TEXTURES,
  getStatAccents,
} from '@/shared/data-access/constants/stat-config'
import { BarsRoot } from '@/shared/features/app-layout/panels/progress-bars-panel.styled'

const ProgressBarsPanel = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate()
  const { stats, adjust } = useStatControls()
  const accents = getStatAccents(theme)

  return (
    <BarsRoot>
      {STAT_BARS.map((bar) => {
        const label = t(bar.labelKey, { defaultValue: bar.key })
        const common = {
          value: stats[bar.key],
          max: STAT_TARGETS[bar.key],
          icon: bar.icon,
          accent: accents[bar.key],
          fillTexture: STAT_FILL_TEXTURES[bar.key],
        }

        // Vibe is earned by completing challenges, not adjusted directly.
        if (bar.key === 'wellbeing') {
          return (
            <VerticalStatBar
              key={bar.key}
              {...common}
              iconScale={1.7}
              onNavigate={() => navigate('/challenges')}
              navigateHint={t('shell.stat.challengesHint')}
            />
          )
        }

        return (
          <VerticalStatBar
            key={bar.key}
            {...common}
            onIncrement={() => adjust(bar.key, 1)}
            onDecrement={() => adjust(bar.key, -1)}
            increaseLabel={t('shell.stat.increase', { stat: label })}
            decreaseLabel={t('shell.stat.decrease', { stat: label })}
          />
        )
      })}
    </BarsRoot>
  )
}

export default ProgressBarsPanel
