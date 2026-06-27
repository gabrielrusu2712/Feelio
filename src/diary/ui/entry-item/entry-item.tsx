import { useCallback, useState } from 'react'
import type { DiaryEntry } from '@/diary/data-access/store/diary.types'
import {
  EntryDate,
  EntryMoodIcon,
  EntryQuestion,
  EntryRoot,
  EntryText,
  ToggleButton,
} from '@/diary/ui/entry-item/entry-item.styled'

interface EntryItemProps {
  entry: DiaryEntry
  expandLabel: string
  collapseLabel: string
}

const EntryItem = (props: EntryItemProps) => {
  const { entry, expandLabel, collapseLabel } = props

  const [expanded, setExpanded] = useState(false)
  const [clamped, setClamped] = useState(false)

  // Measure on mount via a ref callback (while collapsed): only offer "show
  // more" when the text is actually tall enough to be truncated.
  const measureRef = useCallback((node: HTMLParagraphElement | null) => {
    if (node) setClamped(node.scrollHeight > node.clientHeight + 1)
  }, [])

  const formattedDate = new Date(entry.createdAt).toLocaleDateString('ro-RO')

  return (
    <EntryRoot>
      <EntryMoodIcon>{entry.moodEmoji || '✨'}</EntryMoodIcon>
      <EntryDate>{formattedDate}</EntryDate>
      {entry.question ? <EntryQuestion>{entry.question}</EntryQuestion> : null}
      <EntryText ref={measureRef} $expanded={expanded}>
        {entry.entry}
      </EntryText>
      {clamped && (
        <ToggleButton type="button" onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? collapseLabel : expandLabel}
        </ToggleButton>
      )}
    </EntryRoot>
  )
}

export default EntryItem
