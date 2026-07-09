import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/core/store'
import {
  selectPlayerLevel,
  selectTotalStars,
  selectUsername,
  selectXp,
  XP_PER_LEVEL,
} from '@/user/data-access/store'
import LevelRing from '@/shared/ui/level-ring/level-ring'
import CharacterCompanion from '@/shared/features/character/character-companion'
import {
  CharacterSlot,
  LevelBadge,
  Stage,
  StarIcon,
  StarsBadge,
  Username,
} from '@/shared/features/character/character-stage.styled'

// The bear, with the level ring + name pinned to the top-right corner and the
// star count pinned to the top-left — moved here from the top bar so they
// live on the main page, past either side of the character.
const CharacterStage = () => {
  const { t } = useTranslation()
  const username = useAppSelector(selectUsername)
  const totalStars = useAppSelector(selectTotalStars)
  const xp = useAppSelector(selectXp)
  const level = useAppSelector(selectPlayerLevel)

  // The ring fills with progress toward the next level (XP earned by completing
  // wellbeing challenges); leveling up grants the stars spent on the game.
  const progress = Math.round((xp / XP_PER_LEVEL) * 100)

  return (
    <Stage>
      <CharacterSlot>
        <CharacterCompanion />
      </CharacterSlot>

      <StarsBadge>
        <StarIcon src="/assets/shared/star.png" alt="" aria-hidden />
        <span aria-label={t('character.stars', { count: totalStars })}>{totalStars}</span>
      </StarsBadge>

      <LevelBadge>
        <LevelRing level={level} progress={progress} />
        <Username>{username ?? '—'}</Username>
      </LevelBadge>
    </Stage>
  )
}

export default CharacterStage
