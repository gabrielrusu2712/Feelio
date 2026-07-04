import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { selectUid } from '@/shared/data-access/store/current-user.selectors'
import {
  selectAlbumEntries,
  selectAlbumSaveStatus,
  selectAlbumStatus,
} from '@/album/data-access/store'
import { loadEntriesThunk, savePhotoThunk } from '@/album/data-access/store/album.thunks'
import { resetSaveStatus } from '@/album/data-access/store/album.slice'
import { clearPendingClaim, readPendingClaim } from '@/shared/data-access/utils/pending-claim'
import type { PendingClaim } from '@/shared/data-access/utils/pending-claim'
import AlbumUploadCard from '@/album/ui/album-upload-card/album-upload-card'
import AlbumGallery from '@/album/ui/album-gallery/album-gallery'
import AlbumLightbox from '@/album/ui/album-lightbox/album-lightbox'
import { AlbumPageRoot, AlbumScrollBody } from '@/album/features/album-page/album-page.styled'

const AlbumPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const uid = useAppSelector(selectUid)
  const entries = useAppSelector(selectAlbumEntries)
  const status = useAppSelector(selectAlbumStatus)
  const saveStatus = useAppSelector(selectAlbumSaveStatus)

  const [pendingClaim, setPendingClaim] = useState<PendingClaim | null>(() => readPendingClaim())
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  useEffect(() => {
    if (uid && status === 'idle') {
      void dispatch(loadEntriesThunk({ uid }))
    }
  }, [dispatch, uid, status])

  useEffect(() => {
    if (saveStatus === 'saved') {
      clearPendingClaim()
      const timer = setTimeout(() => {
        setPendingClaim(null)
        dispatch(resetSaveStatus())
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [saveStatus, dispatch])

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!uid) return
      void dispatch(savePhotoThunk({ uid, file, claim: pendingClaim }))
    },
    [dispatch, uid, pendingClaim],
  )

  const handleCardClick = useCallback((imageDataUrl: string) => {
    setLightboxSrc(imageDataUrl)
  }, [])

  const handleLightboxClose = useCallback(() => {
    setLightboxSrc(null)
  }, [])

  const showUpload = !!pendingClaim && saveStatus !== 'saved'

  return (
    <AlbumPageRoot>
      <AlbumScrollBody>
        {showUpload && (
          <AlbumUploadCard
            placeName={pendingClaim.placeName}
            hint={t('album.uploadHint')}
            savingLabel={t('album.saving')}
            isSaving={saveStatus === 'saving'}
            onFileSelect={handleFileSelect}
          />
        )}

        <AlbumGallery
          entries={entries}
          emptyMessage={t('album.empty')}
          altText={t('album.altMemory')}
          onCardClick={handleCardClick}
        />
      </AlbumScrollBody>

      <AlbumLightbox
        src={lightboxSrc}
        alt={t('album.altMemory')}
        closeLabel={t('album.closeLightbox')}
        onClose={handleLightboxClose}
      />
    </AlbumPageRoot>
  )
}

export default AlbumPage
