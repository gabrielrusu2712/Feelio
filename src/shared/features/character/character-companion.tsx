import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/core/store'
import {
  clearCharacterAction,
  selectCharacterAction,
  triggerCharacterAction,
} from '@/shared/data-access/store/character-action.slice'
import { selectStats } from '@/user/data-access/store'
import { STAT_TARGETS } from '@/user/data-access/store/user.constants'
import { playCharacterActionSound } from '@/shared/data-access/assets/character-sounds'
import {
  ACTION_ASSETS,
  MOOD_IMAGES,
  prefersStaticPose,
} from '@/shared/data-access/constants/character'
import { getCharacterMood } from '@/shared/data-access/utils/character-mood'
import CharacterSprite from '@/shared/ui/character-sprite/character-sprite'

const ACTION_RESET_MS = 3000

// Smart: the bear's mood comes from the user's stats; an action (tap-to-pet, or
// a stat increment from another panel) plays a short pose, then auto-clears.
const CharacterCompanion = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const stats = useAppSelector(selectStats)
  const characterAction = useAppSelector(selectCharacterAction)

  // Clear the action a beat after it fires; the bumped nonce restarts the timer
  // on each new trigger. Dispatching (not local setState) keeps this effect-safe.
  useEffect(() => {
    if (!characterAction) return
    playCharacterActionSound(characterAction.action)
    const timer = setTimeout(() => dispatch(clearCharacterAction()), ACTION_RESET_MS)
    return () => clearTimeout(timer)
  }, [characterAction, dispatch])

  const mood = getCharacterMood(stats, STAT_TARGETS, new Date().getHours())
  const useStatic = prefersStaticPose()

  let videoSrc: string | null = null
  let imageSrc: string
  if (characterAction) {
    const asset = ACTION_ASSETS[characterAction.action]
    videoSrc = useStatic ? null : asset.webm
    imageSrc = asset.image
  } else {
    imageSrc = MOOD_IMAGES[mood]
  }

  return (
    <CharacterSprite
      key={videoSrc ?? imageSrc}
      videoSrc={videoSrc}
      imageSrc={imageSrc}
      label={t('character.alt')}
      onActivate={() => dispatch(triggerCharacterAction('pet'))}
    />
  )
}

export default CharacterCompanion
