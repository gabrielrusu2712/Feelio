import CharacterStage from '@/shared/features/character/character-stage'
import { CharacterRoot } from '@/shared/features/app-layout/panels/character-panel.styled'

// Desktop character panel: the bear (with level ring and star count flanking
// it), its mood derived from the user's stats.
const CharacterPanel = () => {
  return (
    <CharacterRoot>
      <CharacterStage />
    </CharacterRoot>
  )
}

export default CharacterPanel
