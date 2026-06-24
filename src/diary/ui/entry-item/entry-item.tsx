import type { DiaryEntry } from '@/diary/data-access/store/diary.types'
import {
  EntryDate,
  EntryMoodIcon,
  EntryQuestion,
  EntryRoot,
  EntryText,
} from '@/diary/ui/entry-item/entry-item.styled'

interface EntryItemProps {
  entry: DiaryEntry
}

const EntryItem = (props: EntryItemProps) => {
  const { entry } = props

  const formattedDate = new Date(entry.createdAt).toLocaleDateString('ro-RO')

  return (
    <EntryRoot>
      <EntryMoodIcon>{entry.moodEmoji || '✨'}</EntryMoodIcon>
      <EntryDate>{formattedDate}</EntryDate>
      {entry.question ? <EntryQuestion>{entry.question}</EntryQuestion> : null}
      <EntryText>{entry.entry}</EntryText>
    </EntryRoot>
  )
}

export default EntryItem
