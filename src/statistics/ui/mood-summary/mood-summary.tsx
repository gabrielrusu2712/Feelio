import {
  MoodCard,
  MoodCount,
  MoodEmoji,
  MoodLabel,
  SummaryGrid,
} from '@/statistics/ui/mood-summary/mood-summary.styled'

export interface MoodSummaryItem {
  key: string
  emoji: string
  label: string
  count: number
  unit: string
}

interface MoodSummaryProps {
  items: MoodSummaryItem[]
}

// Dumb: the four mood-count cards for the current chart range.
const MoodSummary = (props: MoodSummaryProps) => {
  const { items } = props

  return (
    <SummaryGrid>
      {items.map((item) => (
        <MoodCard key={item.key}>
          <MoodEmoji aria-hidden>{item.emoji}</MoodEmoji>
          <MoodCount>{item.count}</MoodCount>
          <MoodLabel>
            {item.label} · {item.unit}
          </MoodLabel>
        </MoodCard>
      ))}
    </SummaryGrid>
  )
}

export default MoodSummary
