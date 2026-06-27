import { MOOD_LIST } from '@/diary/data-access/constants/diary.constants'
import type { MoodId } from '@/diary/data-access/constants/diary.constants'
import OptionButton from '@/shared/ui/option-button/option-button'
import {
  MoodEmoji,
  MoodLabel,
  MoodRow,
  MoodSelectorRoot,
} from '@/diary/ui/mood-selector/mood-selector.styled'

interface MoodSelectorProps {
  label: string
  moodLabels: Record<MoodId, string>
  selected: MoodId
  onSelect: (id: MoodId, emoji: string) => void
}

const MoodSelector = (props: MoodSelectorProps) => {
  const { label, moodLabels, selected, onSelect } = props

  return (
    <MoodSelectorRoot>
      <MoodLabel>{label}</MoodLabel>
      <MoodRow>
        {MOOD_LIST.map((mood) => (
          <OptionButton
            key={mood.id}
            active={selected === mood.id}
            ariaLabel={moodLabels[mood.id]}
            onSelect={() => onSelect(mood.id, mood.emoji)}
          >
            <MoodEmoji>{mood.emoji}</MoodEmoji>
          </OptionButton>
        ))}
      </MoodRow>
    </MoodSelectorRoot>
  )
}

export default MoodSelector
