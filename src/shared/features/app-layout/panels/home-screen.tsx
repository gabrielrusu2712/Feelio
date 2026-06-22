import { useTheme } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/core/store'
import { selectStats, selectUsername } from '@/user/data-access/store'
import HorizontalStatBar from '@/shared/ui/horizontal-stat-bar/horizontal-stat-bar'
import Companion from '@/shared/ui/companion/companion'
import { STAT_BARS, STAT_TARGETS, getStatAccents } from '@/shared/data-access/constants/stat-config'
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
  const username = useAppSelector(selectUsername)
  const stats = useAppSelector(selectStats)
  const accents = getStatAccents(theme)

  return (
    <HomeRoot>
      <CharacterArea>
        <Companion greeting={t('shell.character.greeting', { name: username ?? 'friend' })} />
      </CharacterArea>

      <BarsArea>
        {STAT_BARS.map((bar) => (
          <HorizontalStatBar
            key={bar.key}
            value={stats[bar.key]}
            max={STAT_TARGETS[bar.key]}
            icon={bar.icon}
            label={t(bar.labelKey, { defaultValue: bar.key })}
            accent={accents[bar.key]}
          />
        ))}
      </BarsArea>
    </HomeRoot>
  )
}

export default HomeScreen
