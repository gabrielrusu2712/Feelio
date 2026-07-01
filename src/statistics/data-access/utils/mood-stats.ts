import type { MoodCounts } from '@/statistics/data-access/store/statistics.types'

// Resolves a day's mood bucket: prefer the stored bucket, else derive it from the
// completion %. Days with no snapshot stay null (not counted / not charted).
export const normalizeMood = (
  rawMood: number | null,
  percent: number,
  exists: boolean,
): number | null => {
  if (!exists) return null
  if (rawMood !== null && !Number.isNaN(rawMood)) return rawMood
  if (percent > 80) return 3
  if (percent > 50) return 2
  if (percent > 20) return 1
  return 0
}

// Tallies the mood-summary cards from a range's mood buckets.
export const summarizeMoods = (moods: Array<number | null>): MoodCounts => {
  const counts: MoodCounts = { great: 0, good: 0, normal: 0, sad: 0 }
  moods.forEach((mood) => {
    if (mood === 3) counts.great += 1
    else if (mood === 2) counts.good += 1
    else if (mood === 1) counts.normal += 1
    else if (mood === 0) counts.sad += 1
  })
  return counts
}
