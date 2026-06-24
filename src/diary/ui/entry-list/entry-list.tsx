import type { DiaryEntry } from '@/diary/data-access/store/diary.types'
import EntryItem from '@/diary/ui/entry-item/entry-item'
import { EmptyMessage, EntryListRoot, HistoryTitle } from '@/diary/ui/entry-list/entry-list.styled'

interface EntryListProps {
  entries: DiaryEntry[]
  title: string
  emptyMessage: string
}

const EntryList = (props: EntryListProps) => {
  const { entries, title, emptyMessage } = props

  return (
    <div>
      <HistoryTitle>{title}</HistoryTitle>
      <EntryListRoot>
        {entries.length === 0 ? (
          <EmptyMessage>{emptyMessage}</EmptyMessage>
        ) : (
          entries.map((entry) => <EntryItem key={entry.id} entry={entry} />)
        )}
      </EntryListRoot>
    </div>
  )
}

export default EntryList
