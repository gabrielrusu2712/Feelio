import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import {
  BASE_SPEED,
  BG_SCROLL_SPEED,
  GAME_CANVAS,
  HIT_HITBOX_INSET,
  INVINCIBILITY_FRAMES,
  OBSTACLE_SIZE,
  OFFSCREEN_DESPAWN_X,
  ObstacleType,
  PLAYER_START,
  SCORE_PER_OBSTACLE_PASSED,
  SPAWN_CHANCE,
  SPEED_SCORE_DIVISOR,
  STAR_CHANCE,
  STAR_SIZE,
  STARTING_LIVES,
} from '@/game/data-access/constants/game.constants'
import type {
  GameHudState,
  GameResult,
  Obstacle,
} from '@/game/data-access/constants/game.constants'
import { clamp, computeSpeed, intersects } from '@/game/data-access/utils/game-physics'
import {
  hitSound,
  obstacle1Image,
  obstacle2Image,
  playSound,
  rocketDrawSize,
  rocketImage,
  spaceBgImage,
  starImage,
  starSound,
  overSound,
} from '@/game/data-access/assets/game-assets'

interface UseGameLoopArgs {
  canvasRef: RefObject<HTMLCanvasElement | null>
  areaRef: RefObject<HTMLDivElement | null>
  onGameOver: (result: GameResult) => void
}

interface UseGameLoopResult {
  hud: GameHudState
  // True when the play area is taller than the 2:1 design (portrait panel): the
  // canvas fills the whole area instead of fitting a fixed 2:1 window.
  fill: boolean
}

// The designed aspect ratio (2:1). A panel at least this wide keeps the fixed
// window; a taller one triggers fill mode.
const DESIGN_ASPECT = GAME_CANVAS.width / GAME_CANVAS.height

const createObstacle = (canvasWidth: number, canvasHeight: number): Obstacle => {
  const isStar = Math.random() < STAR_CHANCE
  const size = isStar ? STAR_SIZE : OBSTACLE_SIZE
  return {
    x: canvasWidth,
    y: Math.random() * (canvasHeight - size),
    w: size,
    h: size,
    type: isStar ? ObstacleType.STAR : ObstacleType.OBSTACLE,
    image: isStar ? starImage : Math.random() > 0.5 ? obstacle1Image : obstacle2Image,
    passed: false,
  }
}

// The critical port from the source's game.ts: the whole 60fps simulation
// (player/obstacles/bgX/keys/invincibility/score/lives) lives in plain refs and
// closures inside one effect, never in React state — state re-renders would
// tank frame rate. React state (`hud`) is only touched on discrete gameplay
// events (star collected, obstacle passed, hit taken), matching the source's
// own updateHUD() call sites.
export const useGameLoop = (args: UseGameLoopArgs): UseGameLoopResult => {
  const { canvasRef, areaRef, onGameOver } = args

  const [hud, setHud] = useState<GameHudState>({
    lives: STARTING_LIVES,
    score: 0,
    stars: 0,
  })
  const [fill, setFill] = useState(false)

  const keysRef = useRef<Record<string, boolean>>({})
  const onGameOverRef = useRef(onGameOver)
  useEffect(() => {
    onGameOverRef.current = onGameOver
  }, [onGameOver])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Match the backing store to the play area's actual shape so the drawn
    // bitmap is never stretched. A wide/landscape area keeps the fixed 2:1
    // window (letterboxed to fit); a tall/portrait area fills the whole panel,
    // giving a taller play field — obstacle/star/rocket sizes stay fixed pixels,
    // only the background scales to cover.
    const applySize = () => {
      const area = areaRef.current
      const areaWidth = area?.clientWidth ?? 0
      const areaHeight = area?.clientHeight ?? 0
      const shouldFill = areaWidth > 0 && areaHeight > 0 && areaWidth / areaHeight < DESIGN_ASPECT

      const nextWidth = shouldFill ? Math.round(areaWidth) : GAME_CANVAS.width
      const nextHeight = shouldFill ? Math.round(areaHeight) : GAME_CANVAS.height
      // Setting width/height clears the canvas; only touch it on a real change.
      if (canvas.width !== nextWidth) canvas.width = nextWidth
      if (canvas.height !== nextHeight) canvas.height = nextHeight
      setFill(shouldFill)
    }
    applySize()

    const resizeObserver = new ResizeObserver(applySize)
    if (areaRef.current) resizeObserver.observe(areaRef.current)

    const player = { ...PLAYER_START }
    let obstacles: Obstacle[] = []
    let bgX = 0
    let invincibility = 0
    let lives: number = STARTING_LIVES
    let score = 0
    let stars = 0
    let animationId = 0
    let ended = false

    const endGame = () => {
      if (ended) return
      ended = true
      playSound(overSound)
      cancelAnimationFrame(animationId)
      onGameOverRef.current({ score, stars })
    }

    const update = () => {
      const speed = computeSpeed(score, BASE_SPEED, SPEED_SCORE_DIVISOR)

      bgX -= BG_SCROLL_SPEED

      if (keysRef.current.ArrowUp)
        player.y = clamp(player.y - player.speed, 0, canvas.height - player.h)
      if (keysRef.current.ArrowDown)
        player.y = clamp(player.y + player.speed, 0, canvas.height - player.h)

      if (invincibility > 0) invincibility -= 1

      if (Math.random() < SPAWN_CHANCE) {
        obstacles.push(createObstacle(canvas.width, canvas.height))
      }

      obstacles = obstacles.filter((obstacle) => {
        obstacle.x -= speed

        if (intersects(player, obstacle, HIT_HITBOX_INSET)) {
          if (obstacle.type === ObstacleType.STAR) {
            playSound(starSound)
            stars += 1
            setHud({ lives, score, stars })
            return false
          }
          if (invincibility === 0) {
            playSound(hitSound)
            lives -= 1
            invincibility = INVINCIBILITY_FRAMES
            setHud({ lives, score, stars })
            if (lives <= 0) endGame()
            return false
          }
        }

        if (
          obstacle.type === ObstacleType.OBSTACLE &&
          obstacle.x + obstacle.w < player.x &&
          !obstacle.passed
        ) {
          obstacle.passed = true
          score += SCORE_PER_OBSTACLE_PASSED
          setHud({ lives, score, stars })
        }

        return obstacle.x > OFFSCREEN_DESPAWN_X
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Scroll the background as a horizontal tile scaled to cover the full
      // height, keeping the texture's own aspect ratio (zoomed in on tall panels
      // rather than stretched). Black (cleared) fallback until the image loads.
      if (spaceBgImage.complete && spaceBgImage.naturalHeight > 0) {
        const scale = canvas.height / spaceBgImage.naturalHeight
        const tileWidth = spaceBgImage.naturalWidth * scale
        if (tileWidth > 0) {
          bgX %= tileWidth // keep bounded and seamless; negative → (-tileWidth, 0]
          for (let x = bgX; x < canvas.width; x += tileWidth) {
            ctx.drawImage(spaceBgImage, x, 0, tileWidth, canvas.height)
          }
        }
      }

      if (invincibility % 10 < 5) {
        const drawX = player.x + (player.w - rocketDrawSize.width) / 2
        const drawY = player.y + (player.h - rocketDrawSize.height) / 2
        ctx.drawImage(rocketImage, drawX, drawY, rocketDrawSize.width, rocketDrawSize.height)
      }

      obstacles.forEach((obstacle) => {
        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.w, obstacle.h)
      })
    }

    const loop = () => {
      if (ended) return
      update()
      draw()
      animationId = requestAnimationFrame(loop)
    }
    animationId = requestAnimationFrame(loop)

    const handleKeyDown = (event: KeyboardEvent) => {
      keysRef.current[event.code] = true
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current[event.code] = false
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    let dragging = false
    let lastTouchX = 0
    const handleTouchStart = (event: TouchEvent) => {
      if (!event.touches.length) return
      dragging = true
      lastTouchX = event.touches[0].clientX
    }
    // Counterintuitive on purpose (ported from source): dragging right moves the
    // rocket down, matching how the touch gesture felt in the original build.
    const handleTouchMove = (event: TouchEvent) => {
      if (!dragging || !event.touches.length) return
      event.preventDefault()
      const currentX = event.touches[0].clientX
      player.y = clamp(player.y - (currentX - lastTouchX), 0, canvas.height - player.h)
      lastTouchX = currentX
    }
    const handleTouchEnd = () => {
      dragging = false
    }
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true })
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      ended = true
      cancelAnimationFrame(animationId)
      resizeObserver.disconnect()
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
      canvas.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [canvasRef, areaRef])

  return { hud, fill }
}
