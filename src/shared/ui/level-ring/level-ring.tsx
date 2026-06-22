import { Ring, RingInner } from '@/shared/ui/level-ring/level-ring.styled'

interface LevelRingProps {
  level: number
  /** Progress toward the next level, 0–100. */
  progress: number
}

// Dumb: a circular progress ring with the level number at its center.
const LevelRing = (props: LevelRingProps) => {
  const { level, progress } = props
  const clamped = Math.max(0, Math.min(100, progress))

  return (
    <Ring $progress={clamped} role="img" aria-label={`Level ${level}`}>
      <RingInner>{level}</RingInner>
    </Ring>
  )
}

export default LevelRing
