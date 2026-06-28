import CharacterCompanion from '@/shared/features/character/character-companion'
import { CharacterRoot } from '@/shared/features/app-layout/panels/character-panel.styled'

// Desktop character panel: the bear, with its mood derived from the user's stats.
const CharacterPanel = () => {
  return (
    <CharacterRoot>
      <CharacterCompanion />
    </CharacterRoot>
  )
}

export default CharacterPanel
