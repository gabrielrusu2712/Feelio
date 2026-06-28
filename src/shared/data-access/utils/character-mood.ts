import type { Stats } from '@/user/data-access/store'
import type { CharacterMood } from '@/shared/data-access/constants/character'

// Mirrors Feelio-Judeteana's calculateBaseState: happy when the four core daily
// stats all meet their targets; sad in the afternoon when barely any water or
// sleep has been logged; otherwise the neutral resting state.
export const getCharacterMood = (stats: Stats, targets: Stats, hour: number): CharacterMood => {
  const allTargetsMet =
    stats.water >= targets.water &&
    stats.sleep >= targets.sleep &&
    stats.food >= targets.food &&
    stats.sport >= targets.sport
  if (allTargetsMet) return 'happy'
  if (hour >= 14 && stats.water + stats.sleep < 2) return 'sad'
  return 'base'
}
