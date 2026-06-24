import type { AlbumEntry } from '@/album/data-access/store/album.types'
import {
  CardImage,
  CardMeta,
  CardRoot,
  StarsBadge,
} from '@/album/ui/album-entry-card/album-entry-card.styled'

interface AlbumEntryCardProps {
  entry: AlbumEntry
  altText: string
  onClick: (imageDataUrl: string) => void
}

const AlbumEntryCard = (props: AlbumEntryCardProps) => {
  const { entry, altText, onClick } = props

  const formattedDate = new Date(entry.createdAtMs).toLocaleString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <CardRoot onClick={() => onClick(entry.imageDataUrl)}>
      <CardImage src={entry.imageDataUrl} alt={entry.placeName || altText} loading="lazy" />
      <CardMeta>
        <strong>{entry.placeName}</strong>
        <span>{formattedDate}</span>
        {entry.awardedStars > 0 && <StarsBadge>⭐ +{entry.awardedStars}</StarsBadge>}
      </CardMeta>
    </CardRoot>
  )
}

export default AlbumEntryCard
