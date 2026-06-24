import { MOOD_LIST } from '@/diary/data-access/constants/diary.constants'
import type { MoodId } from '@/diary/data-access/constants/diary.constants'
import {
  MoodButton,
  MoodLabel,
  MoodRow,
  MoodSelectorRoot,
} from '@/diary/ui/mood-selector/mood-selector.styled'

interface MoodSelectorProps {
  label: string
  selected: MoodId
  onSelect: (id: MoodId, emoji: string) => void
}

const MoodSelector = (props: MoodSelectorProps) => {
  const { label, selected, onSelect } = props

  return (
    <MoodSelectorRoot>
      <MoodLabel>{label}</MoodLabel>
      <MoodRow>
        {MOOD_LIST.map((mood) => (
          <MoodButton
            key={mood.id}
            type="button"
            $active={selected === mood.id}
            aria-label={mood.id}
            aria-pressed={selected === mood.id}
            onClick={() => onSelect(mood.id as MoodId, mood.emoji)}
          >
            {mood.emoji}
          </MoodButton>
        ))}
      </MoodRow>
    </MoodSelectorRoot>
  )
}

export default MoodSelector
