import { useTheme } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { STAT_TARGETS } from '@/user/data-access/store/user.constants'
import { useStatControls } from '@/shared/data-access/hooks/use-stat-controls'
import HorizontalStatBar from '@/shared/ui/horizontal-stat-bar/horizontal-stat-bar'
import CharacterStage from '@/shared/features/character/character-stage'
import {
  STAT_BARS,
  STAT_FILL_TEXTURES,
  getStatAccents,
} from '@/shared/data-access/constants/stat-config'
import {
  BarsArea,
  CharacterArea,
  HomeRoot,
} from '@/shared/features/app-layout/panels/home-screen.styled'

// Portrait home: the bear on top, horizontal stat bars below. The game launcher
// lives in the page menu (the 'game' view), not as a button here.
const HomeScreen = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate()
  const { stats, adjust } = useStatControls()
  const accents = getStatAccents(theme)

  return (
    <HomeRoot>
      <CharacterArea>
        <CharacterStage />
      </CharacterArea>

      <BarsArea>
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
              <HorizontalStatBar
                key={bar.key}
                {...common}
                iconScale={1.25}
                onNavigate={() => navigate('/challenges')}
                navigateHint={t('shell.stat.challengesHint')}
              />
            )
          }

          return (
            <HorizontalStatBar
              key={bar.key}
              {...common}
              onIncrement={() => adjust(bar.key, 1)}
              onDecrement={() => adjust(bar.key, -1)}
              increaseLabel={t('shell.stat.increase', { stat: label })}
              decreaseLabel={t('shell.stat.decrease', { stat: label })}
            />
          )
        })}
      </BarsArea>
    </HomeRoot>
  )
}

export default HomeScreen
