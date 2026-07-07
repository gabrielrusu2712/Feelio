import { HudBar, Lives, Score, Stars } from '@/game/ui/game-hud/game-hud.styled'

interface GameHudProps {
  lives: number
  score: number
  stars: number
  scoreLabel: string
  livesLabel: string
}

const GameHud = (props: GameHudProps) => {
  const { lives, score, stars, scoreLabel, livesLabel } = props

  return (
    <HudBar>
      <Lives aria-label={livesLabel}>{'❤️'.repeat(lives)}</Lives>
      <Score>
        {scoreLabel}: {score}
      </Score>
      <Stars>⭐ {stars}</Stars>
    </HudBar>
  )
}

export default GameHud
