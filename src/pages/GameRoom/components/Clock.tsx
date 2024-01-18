import { FASTEST_FINGER_TIME } from '@/config/appConfig'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { useParams } from 'react-router-dom'
import { GameStates } from '../../../lib/types'
import { updateGameState } from '../../GameCreation/utils/http'

type ClockProps = {
  roundTime: number
  gameState: GameStates | undefined
}

const Clock = ({ roundTime, gameState }: ClockProps) => {
  const params = useParams()

  const isPlaying = gameState === 'STARTED' || gameState === 'END-TIMER'
  const totalTime = calcDuration()
  function calcDuration() {
    if (gameState === 'END-TIMER') return FASTEST_FINGER_TIME
    if (!gameState || gameState === 'STARTED') return roundTime
    return 0
  }

  const key = !gameState || gameState === 'STARTED' ? 'STARTED' : 'END-TIMER'

  const renderTime = ({ remainingTime }: { remainingTime: number }) => {
    const minutes = remainingTime <= 0 ? 0 : Math.floor(remainingTime / 60)
    const seconds = remainingTime <= 0 ? 0 : remainingTime % 60

    // if (remainingTime === 0) setTimeRemaining(0)
    if (remainingTime === 0 && gameState !== 'ROUND-ENDED')
      updateGameState('TIME-ENDED', params.roomId!)

    return (
      <div role="timer" aria-live="assertive">
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
        duration={totalTime}
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
