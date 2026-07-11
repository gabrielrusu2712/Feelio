import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useGameLoop } from '@/game/data-access/hooks/use-game-loop'
import type { GameResult } from '@/game/data-access/constants/game.constants'
import GameHud from '@/game/ui/game-hud/game-hud'
import { Canvas, CanvasArea, CanvasRoot } from '@/game/features/game-canvas/game-canvas.styled'

interface GameCanvasProps {
  onGameOver: (result: GameResult) => void
  /** Fill the whole area (fullscreen) rather than the fixed 2:1 window. */
  fullscreen?: boolean
}

// Keyboard (arrow up/down) and touch-drag are wired inside useGameLoop directly
// on the canvas element.
const GameCanvas = (props: GameCanvasProps) => {
  const { onGameOver, fullscreen = false } = props
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const areaRef = useRef<HTMLDivElement>(null)

  const { hud, fill } = useGameLoop({ canvasRef, areaRef, onGameOver, forceFill: fullscreen })

  return (
    <CanvasRoot>
      <GameHud
        lives={hud.lives}
        score={hud.score}
        stars={hud.stars}
        scoreLabel={t('game.labelScore')}
        livesLabel={t('game.labelLives', { lives: hud.lives })}
      />
      <CanvasArea ref={areaRef}>
        <Canvas ref={canvasRef} $fill={fill} role="img" aria-label={t('game.canvasLabel')} />
      </CanvasArea>
    </CanvasRoot>
  )
}

export default GameCanvas
