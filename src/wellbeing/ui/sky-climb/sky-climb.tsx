import { useLayoutEffect, useRef, useState } from 'react'

import {
  Bear,
  CloudImg,
  CloudNode,
  CloudNum,
  Drop,
  Rain,
  Sky,
  Sun,
  Track,
} from '@/wellbeing/ui/sky-climb/sky-climb.styled'
import type { NodeState } from '@/wellbeing/ui/sky-climb/sky-climb.styled'

interface SkyClimbProps {
  total: number
  /** Highest completed level (0..total); the active level is completed + 1. */
  completed: number
  lockedLabel: string
  onOpen: (level: number) => void
}

const CLOUD_COMPLETE = '/assets/shared/cloud-complete.png'
const CLOUD_INCOMPLETE = '/assets/shared/cloud-incomplete.png'
const BEAR = '/assets/shared/panda-balloon.png'

// A few rain droplets at deterministic offsets/delays (no Math.random) so the
// incomplete "dark" clouds drizzle.
const DROPS = [
  { left: 20, delay: 0 },
  { left: 40, delay: 0.45 },
  { left: 60, delay: 0.2 },
  { left: 78, delay: 0.7 },
]

const stateFor = (level: number, completed: number): NodeState => {
  if (level <= completed) return 'completed'
  if (level === completed + 1) return 'active'
  return 'locked'
}

// Vertical climb: clouds stack from the ground (level 1, bottom) up to the sun
// (top). The panda-balloon rises as levels complete. Incomplete clouds are dark
// and rain; completed clouds turn white. The number rides each cloud.
const SkyClimb = (props: SkyClimbProps) => {
  const { total, completed, lockedLabel, onOpen } = props

  const levels = Array.from({ length: total }, (_, index) => index + 1)
  // The bear perches on the cloud you're currently climbing (the active level),
  // or the top cloud once every level is done.
  const bearLevel = completed >= total ? total : completed + 1

  const trackRef = useRef<HTMLDivElement>(null)
  const [bearPos, setBearPos] = useState<{ x: number; y: number } | null>(null)
  // Instant scroll the first time a climb is shown (positions you at the bear on
  // open); smooth afterwards so completing a level glides the view up with it.
  const firstScrollRef = useRef(true)

  // Measure the target cloud's on-screen box (getBoundingClientRect includes the
  // zig-zag translateX + active scale, which offsetLeft would miss) and place the
  // bear at its horizontal centre, feet resting near the top of the puffs. A
  // ResizeObserver re-measures when the panel width changes the cqi-based layout.
  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    const measure = () => {
      const node = track.querySelector<HTMLElement>(`[data-level="${bearLevel}"]`)
      if (!node) return
      const nodeRect = node.getBoundingClientRect()
      const trackRect = track.getBoundingClientRect()
      const x = nodeRect.left - trackRect.left + nodeRect.width / 2
      const y = nodeRect.top - trackRect.top + nodeRect.height * 0.48
      setBearPos({ x, y })
    }
    measure()

    // Bring the bear's cloud into view when the climb opens or the bear moves up.
    const activeNode = track.querySelector<HTMLElement>(`[data-level="${bearLevel}"]`)
    activeNode?.scrollIntoView({
      block: 'center',
      behavior: firstScrollRef.current ? 'auto' : 'smooth',
    })
    firstScrollRef.current = false

    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [bearLevel, total])

  return (
    <Sky>
      <Sun aria-hidden />
      <Track ref={trackRef}>
        {bearPos && <Bear src={BEAR} alt="" aria-hidden $x={bearPos.x} $y={bearPos.y} />}
        {levels.map((level) => {
          const state = stateFor(level, completed)
          const locked = state === 'locked'
          const incomplete = state !== 'completed'
          const side = level % 2 === 0 ? 'right' : 'left'
          return (
            <CloudNode
              key={level}
              type="button"
              data-level={level}
              $state={state}
              $side={side}
              disabled={locked}
              aria-label={locked ? lockedLabel : undefined}
              onClick={() => !locked && onOpen(level)}
            >
              <CloudImg src={incomplete ? CLOUD_INCOMPLETE : CLOUD_COMPLETE} alt="" aria-hidden />
              <CloudNum $state={state}>{level}</CloudNum>
              {incomplete && (
                <Rain aria-hidden>
                  {DROPS.map((drop) => (
                    <Drop key={drop.left} $left={drop.left} $delay={drop.delay} />
                  ))}
                </Rain>
              )}
            </CloudNode>
          )
        })}
      </Track>
    </Sky>
  )
}

export default SkyClimb
