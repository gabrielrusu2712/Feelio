import {
  OverRoot,
  PlayAgainButton,
  ResultLine,
  Title,
} from '@/game/ui/game-over-screen/game-over-screen.styled'

interface GameOverScreenProps {
  title: string
  score: number
  stars: number
  scoreLabel: string
  starsLabel: string
  playAgainLabel: string
  onPlayAgain: () => void
}

const GameOverScreen = (props: GameOverScreenProps) => {
  const { title, score, stars, scoreLabel, starsLabel, playAgainLabel, onPlayAgain } = props

  return (
    <OverRoot>
      <Title>{title}</Title>
      <ResultLine>
        {scoreLabel}: {score}
      </ResultLine>
      <ResultLine>
        {starsLabel}: {stars}
      </ResultLine>
      <PlayAgainButton type="button" onClick={onPlayAgain}>
        {playAgainLabel}
      </PlayAgainButton>
    </OverRoot>
  )
}

export default GameOverScreen
