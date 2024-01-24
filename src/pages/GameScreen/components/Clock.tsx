import { FASTEST_FINGER_TIME } from '@/config/gameConfig'
import { useMemo } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { useParams } from 'react-router-dom'
import { GameStates } from '../../../lib/types'
import { updateGameState } from '../../../utils/http'
import { getFromSessionStorage, saveToSessionStorage } from './util/utils'

type ClockProps = {
  roundTime: number
  gameState: GameStates
  currentRound: number
}

const Clock = ({ roundTime, gameState, currentRound }: ClockProps) => {
  const params = useParams()

  const duration = gameState === 'END-TIMER' ? FASTEST_FINGER_TIME : roundTime

  const initialRemainingTime = useMemo(() => {
    const storageKey = 'time' + params.roomId! + currentRound
    const timerEndTime = Date.now() + roundTime * 1000

    const timeInStorage = getFromSessionStorage<number>(storageKey)

    if (!timeInStorage) {
      saveToSessionStorage(storageKey, timerEndTime)
      return roundTime
    }
    const timeInSeconds = (timeInStorage - Date.now()) / 1000

    if (timeInSeconds > FASTEST_FINGER_TIME && gameState === 'END-TIMER') {
      saveToSessionStorage(storageKey, FASTEST_FINGER_TIME)
      return FASTEST_FINGER_TIME
    }

    return timeInSeconds
  }, [currentRound, params.roomId, roundTime, gameState])

  console.log(initialRemainingTime)

  const isPlaying = initialRemainingTime > 0

  const key = !gameState || gameState === 'STARTED' ? 'STARTED' : 'END-TIMER'

  async function setTimeEndedState() {
    try {
      await updateGameState('TIME-ENDED', params.roomId!)
    } catch (error) {
      throw new Error('An error occurred!')
    }
  }

  const renderTime = ({ remainingTime }: { remainingTime: number }) => {
    const minutes = remainingTime <= 0 ? 0 : Math.floor(remainingTime / 60)
    const seconds = remainingTime <= 0 ? 0 : remainingTime % 60

    if (remainingTime <= 0 && gameState !== 'ROUND-ENDED') {
      setTimeEndedState()
    }

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
        {renderTime}
      </CountdownCircleTimer>
    </div>
  )
}
export default Clock
