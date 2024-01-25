import { FASTEST_FINGER_TIME, TIME_STORAGE_KEY } from '@/config/gameConfig'
import { useMemo } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { useParams } from 'react-router-dom'
import { GameStates } from '../../../lib/types'
import { updateGameState } from '../../../utils/http'
import { getTimeInStorage, saveToSessionStorage } from './util/utils'

type ClockProps = {
  roundTime: number
  gameState: GameStates
  currentRound: number
}

const Clock = ({ roundTime, gameState, currentRound }: ClockProps) => {
  const params = useParams()

  const isEndTimer = gameState === 'END-TIMER'

  const key = isEndTimer ? 'END-TIMER' : 'STARTED'

  const duration = isEndTimer ? FASTEST_FINGER_TIME : roundTime

  const initialRemainingTime = useMemo(() => {
    const storageKey = TIME_STORAGE_KEY(params.roomId!, currentRound)
    const timeRemaining = getTimeInStorage(storageKey)
    const timerEndTime = (time: number) => Date.now() + time * 1000

    if (!timeRemaining) {
      saveToSessionStorage(storageKey, timerEndTime(roundTime))
      return roundTime
    }

    if (isEndTimer && timeRemaining > FASTEST_FINGER_TIME) {
      saveToSessionStorage(storageKey, timerEndTime(FASTEST_FINGER_TIME))
      return FASTEST_FINGER_TIME
    }
    return timeRemaining
  }, [roundTime, currentRound, params.roomId, isEndTimer])

  const isPlaying = gameState !== 'ROUND-ENDED' && gameState !== 'TIME-ENDED'

  async function setTimeEndedState() {
    try {
      await updateGameState('TIME-ENDED', params.roomId!)
    } catch (error) {
      throw new Error('An error occurred!')
    }
  }

  const RenderTime = ({ remainingTime }: { remainingTime: number }) => {
    const minutes = remainingTime <= 0 ? 0 : Math.floor(remainingTime / 60)
    const seconds = remainingTime <= 0 ? 0 : remainingTime % 60

    if (
      remainingTime <= 0 &&
      gameState !== 'TIME-ENDED' &&
      gameState !== 'ROUND-ENDED'
    )
      setTimeEndedState()

    return (
      <div role="timer" aria-live="assertive" aria-label="round timer">
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </div>
    )
  }

  return (
    <div className="ml-auto">
      <CountdownCircleTimer
        key={key}
        strokeWidth={6}
        strokeLinecap={'round'}
        size={80}
        isPlaying={isPlaying}
        initialRemainingTime={initialRemainingTime}
        duration={duration}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[60, 45, 30, 15]}
        onComplete={() => ({ shouldRepeat: false })}
      >
        {RenderTime}
      </CountdownCircleTimer>
    </div>
  )
}
export default Clock
