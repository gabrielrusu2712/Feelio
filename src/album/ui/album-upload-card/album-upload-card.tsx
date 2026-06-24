import { useRef } from 'react'
import {
  PlaceName,
  PlusIcon,
  SavingOverlay,
  UploadHint,
  UploadRoot,
} from '@/album/ui/album-upload-card/album-upload-card.styled'

interface AlbumUploadCardProps {
  placeName: string
  hint: string
  savingLabel: string
  isSaving: boolean
  onFileSelect: (file: File) => void
}

const AlbumUploadCard = (props: AlbumUploadCardProps) => {
  const { placeName, hint, savingLabel, isSaving, onFileSelect } = props
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (!isSaving) inputRef.current?.click()
  }

  const handleChange = () => {
    const file = inputRef.current?.files?.[0]
    if (file) {
      onFileSelect(file)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <UploadRoot onClick={handleClick} role="button" aria-disabled={isSaving}>
      <PlusIcon>+</PlusIcon>
      <UploadHint>
        {hint} <PlaceName>{placeName}</PlaceName>
      </UploadHint>
      {isSaving && <SavingOverlay>{savingLabel}</SavingOverlay>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </UploadRoot>
  )
}

export default AlbumUploadCard
