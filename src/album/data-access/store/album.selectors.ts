import type { RootState } from '@/core/store/store'

const selectAlbum = (state: RootState) => state.album

export const selectAlbumEntries = (state: RootState) => selectAlbum(state).entries
export const selectAlbumStatus = (state: RootState) => selectAlbum(state).status
export const selectAlbumSaveStatus = (state: RootState) => selectAlbum(state).saveStatus
export const selectLastRewardStars = (state: RootState) => selectAlbum(state).lastRewardStars
