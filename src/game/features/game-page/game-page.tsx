import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { selectUid } from '@/shared/data-access/store/current-user.selectors'
import { selectTotalStars } from '@/user/data-access/store/user.selectors'
import { awardSessionStarsThunk, spendStarsToPlayThunk } from '@/game/data-access/store/game.thunks'
import { GAME_COST_STARS, GamePhase } from '@/game/data-access/constants/game.constants'
import type { GamePhaseType, GameResult } from '@/game/data-access/constants/game.constants'
import GameStartScreen from '@/game/ui/game-start-screen/game-start-screen'
import GameCanvas from '@/game/features/game-canvas/game-canvas'
import GameOverScreen from '@/game/ui/game-over-screen/game-over-screen'
import { GamePageRoot } from '@/game/features/game-page/game-page.styled'

const INITIAL_RESULT: GameResult = { score: 0, stars: 0 }

const GamePage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const uid = useAppSelector(selectUid)
  const totalStars = useAppSelector(selectTotalStars)

  const [phase, setPhase] = useState<GamePhaseType>(GamePhase.START)
  const [sessionId, setSessionId] = useState(0)
  const [result, setResult] = useState<GameResult>(INITIAL_RESULT)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handlePlay = useCallback(() => {
    if (!uid || pending) return
    setErrorMessage(null)
    setPending(true)

    void (async () => {
      const action = await dispatch(spendStarsToPlayThunk({ uid, cost: GAME_COST_STARS }))
      setPending(false)

      const succeeded = spendStarsToPlayThunk.fulfilled.match(action)
      if (succeeded && action.payload) {
        setSessionId((id) => id + 1)
        setPhase(GamePhase.PLAYING)
        return
      }

      setErrorMessage(succeeded ? t('game.notEnoughStars') : t('game.error.spendFailed'))
    })()
  }, [dispatch, uid, pending, t])

  const handleGameOver = useCallback(
    (session: GameResult) => {
      setResult(session)
      setPhase(GamePhase.OVER)
      if (uid && session.stars > 0) {
        void dispatch(awardSessionStarsThunk({ uid, stars: session.stars }))
      }
    },
    [dispatch, uid],
  )

  const handlePlayAgain = useCallback(() => {
    setErrorMessage(null)
    setPhase(GamePhase.START)
  }, [])

  return (
    <GamePageRoot>
      {phase === GamePhase.START ? (
        <GameStartScreen
          title={t('game.title')}
          costLabel={t('game.cost', { cost: GAME_COST_STARS })}
          avoidLabel={t('game.tutorialAvoid')}
          collectLabel={t('game.tutorialCollect')}
          playLabel={t('game.play')}
          errorMessage={
            errorMessage ?? (totalStars < GAME_COST_STARS ? t('game.notEnoughStars') : null)
          }
          pending={pending}
          onPlay={handlePlay}
        />
      ) : phase === GamePhase.PLAYING ? (
        <GameCanvas key={sessionId} onGameOver={handleGameOver} />
      ) : (
        <GameOverScreen
          title={t('game.overTitle')}
          score={result.score}
          stars={result.stars}
          scoreLabel={t('game.labelScore')}
          starsLabel={t('game.labelStars')}
          playAgainLabel={t('game.playAgain')}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </GamePageRoot>
  )
}

export default GamePage
