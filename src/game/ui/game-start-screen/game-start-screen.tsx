import obstacle1Url from '@/game/data-access/assets/images/obstacle-1.png'
import obstacle2Url from '@/game/data-access/assets/images/obstacle-2.png'
import starUrl from '@/game/data-access/assets/images/star.png'
import {
  CostText,
  ErrorText,
  PlayButton,
  StartRoot,
  Title,
  TutorialBox,
  TutorialIcon,
  TutorialRow,
} from '@/game/ui/game-start-screen/game-start-screen.styled'

interface GameStartScreenProps {
  title: string
  costLabel: string
  avoidLabel: string
  collectLabel: string
  playLabel: string
  errorMessage: string | null
  pending: boolean
  onPlay: () => void
}

const GameStartScreen = (props: GameStartScreenProps) => {
  const { title, costLabel, avoidLabel, collectLabel, playLabel, errorMessage, pending, onPlay } =
    props

  return (
    <StartRoot>
      <Title>{title}</Title>
      <CostText>{costLabel}</CostText>

      <TutorialBox>
        <p>{avoidLabel}</p>
        <TutorialRow>
          <TutorialIcon src={obstacle1Url} alt="" />
          <TutorialIcon src={obstacle2Url} alt="" />
        </TutorialRow>
        <p>{collectLabel}</p>
        <TutorialIcon src={starUrl} alt="" />
      </TutorialBox>

      {errorMessage ? <ErrorText role="alert">{errorMessage}</ErrorText> : null}

      <PlayButton type="button" disabled={pending} onClick={onPlay}>
        {playLabel}
      </PlayButton>
    </StartRoot>
  )
}

export default GameStartScreen
