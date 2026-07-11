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
import { GamePageRoot } from '@/game/features/game-page/game-page.styled'

interface GamePageProps {
  /** Fullscreen state + toggle, wired only in the landscape shell (undefined on mobile). */
  expanded?: boolean
  onToggleExpand?: () => void
}

const GamePage = (props: GamePageProps) => {
  const { expanded = false, onToggleExpand } = props
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const uid = useAppSelector(selectUid)
  const totalStars = useAppSelector(selectTotalStars)

  const [phase, setPhase] = useState<GamePhaseType>(GamePhase.START)
  const [sessionId, setSessionId] = useState(0)
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

  // On game over, award the run's stars and go straight back to the start menu
  // (no separate "play again" screen — it just sent you here anyway).
  const handleGameOver = useCallback(
    (session: GameResult) => {
      setErrorMessage(null)
      setPhase(GamePhase.START)
      if (uid && session.stars > 0) {
        void dispatch(awardSessionStarsThunk({ uid, stars: session.stars }))
      }
    },
    [dispatch, uid],
  )

  return (
    // data-no-dnd: the game's own drag-to-steer would otherwise also trigger the
    // panel-reorder drag. Like the map, this marks the whole game view off-limits
    // to the panel sortable sensor (see smart-pointer-sensor.ts).
    <GamePageRoot data-no-dnd="true">
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
          onToggleFullscreen={onToggleExpand}
          isFullscreen={expanded}
          fullscreenLabel={t('game.fullscreen')}
          exitFullscreenLabel={t('game.exitFullscreen')}
        />
      ) : (
        <GameCanvas key={sessionId} onGameOver={handleGameOver} fullscreen={expanded} />
      )}
    </GamePageRoot>
  )
}

export default GamePage
