import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/core/store'
import { selectUsername } from '@/user/data-access/store'
import Companion from '@/shared/ui/companion/companion'
import { CharacterRoot } from '@/shared/features/app-layout/panels/character-panel.styled'

// Placeholder companion. The real character (mood from stats, sprites,
// speech-bubble logic) is built in Phase 2.
const CharacterPanel = () => {
  const { t } = useTranslation()
  const username = useAppSelector(selectUsername)

  return (
    <CharacterRoot>
      <Companion greeting={t('shell.character.greeting', { name: username ?? 'friend' })} />
    </CharacterRoot>
  )
}

export default CharacterPanel
