import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useGameLoop } from '@/game/data-access/hooks/use-game-loop'
import type { GameResult } from '@/game/data-access/constants/game.constants'
import GameHud from '@/game/ui/game-hud/game-hud'
import MobileControls from '@/game/ui/mobile-controls/mobile-controls'
import { Canvas, CanvasArea, CanvasRoot } from '@/game/ui/game-canvas/game-canvas.styled'

interface GameCanvasProps {
  onGameOver: (result: GameResult) => void
}

// Keyboard (arrow up/down) and touch-drag are wired inside useGameLoop directly
// on the canvas element; MobileControls is an explicit on-screen alternative
// for devices where a drag gesture over the play area is awkward.
const GameCanvas = (props: GameCanvasProps) => {
  const { onGameOver } = props
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const areaRef = useRef<HTMLDivElement>(null)

  const { hud, fill, setVerticalInput } = useGameLoop({ canvasRef, areaRef, onGameOver })

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
      <MobileControls
        upLabel={t('game.controlUp')}
        downLabel={t('game.controlDown')}
        onPress={setVerticalInput}
      />
    </CanvasRoot>
  )
}

export default GameCanvas
