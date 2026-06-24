export type AlbumStatus = 'idle' | 'loading' | 'ready' | 'error'
export type AlbumSaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export interface AlbumEntry {
  id: string
  imageDataUrl: string
  placeName: string
  createdAtMs: number
  awardedStars: number
}

export interface AlbumState {
  entries: AlbumEntry[]
  status: AlbumStatus
  saveStatus: AlbumSaveStatus
  error: string | null
  lastRewardStars: number | null
}
