import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '@/core/services/firebase'
import {
  ALBUM_DAILY_MAX_REWARDS,
  ALBUM_ENTRIES_COLLECTION,
  ALBUM_MAX_ENTRIES,
  LOCATION_REWARDS_COLLECTION,
  USERS_COLLECTION,
} from '@/album/data-access/constants/album.constants'
import type { PendingClaim } from '@/shared/data-access/utils/pending-claim'
import type { AlbumEntry } from '@/album/data-access/store/album.types'
import { compressImage, readFileAsDataURL } from '@/album/data-access/utils/image-utils'

const albumEntriesRef = (uid: string) =>
  collection(doc(collection(db, USERS_COLLECTION), uid), ALBUM_ENTRIES_COLLECTION)

const locationRewardsRef = (uid: string) =>
  collection(doc(collection(db, USERS_COLLECTION), uid), LOCATION_REWARDS_COLLECTION)

function albumDayKey(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const fetchAlbumEntries = async (uid: string): Promise<AlbumEntry[]> => {
  const q = query(albumEntriesRef(uid), orderBy('createdAtMs', 'desc'), limit(ALBUM_MAX_ENTRIES))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      imageDataUrl: data.imageDataUrl ?? '',
      placeName: data.placeName ?? 'Memory',
      createdAtMs: Number(data.createdAtMs ?? Date.now()),
      awardedStars: Number(data.awardedStars ?? 0),
    }
  })
}

async function applyRewardIfEligible(
  uid: string,
  photoDocId: string,
  claim: PendingClaim,
): Promise<number> {
  const dayKey = albumDayKey()
  const rewardsRef = locationRewardsRef(uid)
  const q = query(rewardsRef, where('dayKey', '==', dayKey))
  const snap = await getDocs(q)
  if (snap.size >= ALBUM_DAILY_MAX_REWARDS) return 0

  const stars = Number(claim.stars || 20)
  const userRef = doc(collection(db, USERS_COLLECTION), uid)

  await Promise.all([
    updateDoc(userRef, { totalStars: increment(stars) }),
    addDoc(rewardsRef, {
      createdAtMs: Date.now(),
      dayKey,
      placeKey: claim.placeKey,
      placeName: claim.placeName,
      starsAwarded: stars,
      photoDocId,
    }),
  ])

  return stars
}

export interface SavePhotoArgs {
  uid: string
  file: File
  claim: PendingClaim | null
}

export interface SavePhotoResult {
  entry: AlbumEntry
  starsEarned: number
}

export const saveAlbumEntry = async (args: SavePhotoArgs): Promise<SavePhotoResult> => {
  const { uid, file, claim } = args
  const rawDataUrl = await readFileAsDataURL(file)
  const imageDataUrl = await compressImage(rawDataUrl)
  const placeName = claim?.placeName ?? 'Memory'
  const createdAtMs = Date.now()

  const docRef = await addDoc(albumEntriesRef(uid), {
    imageDataUrl,
    placeName,
    createdAtMs,
    awardedStars: 0,
  })

  let starsEarned = 0
  if (claim) {
    starsEarned = await applyRewardIfEligible(uid, docRef.id, claim)
    if (starsEarned > 0) {
      await updateDoc(docRef, { awardedStars: starsEarned })
    }
  }

  return {
    entry: { id: docRef.id, imageDataUrl, placeName, createdAtMs, awardedStars: starsEarned },
    starsEarned,
  }
}
