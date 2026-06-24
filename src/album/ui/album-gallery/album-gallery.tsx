import type { AlbumEntry } from '@/album/data-access/store/album.types'
import AlbumEntryCard from '@/album/ui/album-entry-card/album-entry-card'
import { EmptyState, GalleryRoot } from '@/album/ui/album-gallery/album-gallery.styled'

interface AlbumGalleryProps {
  entries: AlbumEntry[]
  emptyMessage: string
  altText: string
  onCardClick: (imageDataUrl: string) => void
}

const AlbumGallery = (props: AlbumGalleryProps) => {
  const { entries, emptyMessage, altText, onCardClick } = props

  if (entries.length === 0) {
    return (
      <GalleryRoot>
        <EmptyState>{emptyMessage}</EmptyState>
      </GalleryRoot>
    )
  }

  return (
    <GalleryRoot>
      {entries.map((entry) => (
        <AlbumEntryCard key={entry.id} entry={entry} altText={altText} onClick={onCardClick} />
      ))}
    </GalleryRoot>
  )
}

export default AlbumGallery
