import obstacle1Url from '@/game/data-access/assets/images/obstacle-1.png'
import obstacle2Url from '@/game/data-access/assets/images/obstacle-2.png'
import starUrl from '@/game/data-access/assets/images/star.png'
import {
  CostText,
  ErrorText,
  FullscreenButton,
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
  /** Fullscreen toggle — only rendered when provided (landscape shell only). */
  onToggleFullscreen?: () => void
  isFullscreen?: boolean
  fullscreenLabel?: string
  exitFullscreenLabel?: string
}

const GameStartScreen = (props: GameStartScreenProps) => {
  const { title, costLabel, avoidLabel, collectLabel, playLabel, errorMessage, pending, onPlay } =
    props
  const { onToggleFullscreen, isFullscreen, fullscreenLabel, exitFullscreenLabel } = props

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

      {onToggleFullscreen ? (
        <FullscreenButton type="button" onClick={onToggleFullscreen} aria-pressed={isFullscreen}>
          {isFullscreen ? `⤡ ${exitFullscreenLabel}` : `⤢ ${fullscreenLabel}`}
        </FullscreenButton>
      ) : null}
    </StartRoot>
  )
}

export default GameStartScreen
