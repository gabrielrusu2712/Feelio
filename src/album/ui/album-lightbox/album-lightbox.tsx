import { useEffect } from 'react'
import {
  CloseButton,
  LightboxImage,
  LightboxOverlay,
} from '@/album/ui/album-lightbox/album-lightbox.styled'

interface AlbumLightboxProps {
  src: string | null
  alt: string
  closeLabel: string
  onClose: () => void
}

const AlbumLightbox = (props: AlbumLightboxProps) => {
  const { src, alt, closeLabel, onClose } = props

  useEffect(() => {
    if (!src) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [src, onClose])

  return (
    <LightboxOverlay $visible={!!src} onClick={onClose} aria-hidden={!src}>
      {src && <LightboxImage src={src} alt={alt} onClick={(e) => e.stopPropagation()} />}
      <CloseButton onClick={onClose} aria-label={closeLabel}>
        ✕
      </CloseButton>
    </LightboxOverlay>
  )
}

export default AlbumLightbox
