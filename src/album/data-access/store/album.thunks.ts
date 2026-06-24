import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchAlbumEntries, saveAlbumEntry } from '@/album/data-access/api/album.api'
import type { SavePhotoArgs, SavePhotoResult } from '@/album/data-access/api/album.api'
import type { AlbumEntry } from '@/album/data-access/store/album.types'

interface LoadEntriesArgs {
  uid: string
}

export const loadEntriesThunk = createAsyncThunk<
  AlbumEntry[],
  LoadEntriesArgs,
  { rejectValue: string }
>('album/loadEntries', async (args, { rejectWithValue }) => {
  try {
    return await fetchAlbumEntries(args.uid)
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'album.error.loadFailed')
  }
})

export const savePhotoThunk = createAsyncThunk<
  SavePhotoResult,
  SavePhotoArgs,
  { rejectValue: string }
>('album/savePhoto', async (args, { rejectWithValue }) => {
  try {
    return await saveAlbumEntry(args)
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'album.error.saveFailed')
  }
})
