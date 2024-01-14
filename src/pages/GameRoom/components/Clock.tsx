import { FASTEST_FINGER_TIME } from '@/config/appConfig'
import { useEffect, useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { useParams } from 'react-router-dom'
import { GameStates } from '../../../lib/types'
import { updateGameState } from '../../GameCreation/utils/http'

type ClockProps = {
  roundTime: number
  gameState: GameStates | undefined
}

const Clock = ({ roundTime, gameState }: ClockProps) => {
  const [timeRemaining, setTimeRemaining] = useState(roundTime * 500)
  const params = useParams()

  const isPlaying = gameState === ('STARTED' || 'END-TIMER')

  const renderTime = ({ remainingTime }: { remainingTime: number }) => {
    const minutes = Math.floor(remainingTime / 60)
    const seconds = remainingTime % 60

    if (remainingTime === 0) setTimeRemaining(0)

    return (
      <div role="timer" aria-live="assertive">
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </div>
    )
  }

  useEffect(() => {
    if (timeRemaining === 0 && gameState !== 'ROUND-ENDED')
      updateGameState('TIME-ENDED', params.roomId!)
    if (gameState === 'END-TIMER') setTimeRemaining(FASTEST_FINGER_TIME)

    // switch (gameState) {
    //   /* case 'INIT':
    //     updateGameState('STARTED', params.roomId!)
    //     break */
    //   case 'STARTED':
    //     // startTimer()
    //     break
    //   case 'END-TIMER':
    //     {
    //       setTimeRemaining(15)
    //       // startTimer()
    //     }
    //     break
    //   case 'ROUND-ENDED':
    //     stopTimer()
    //     break
    //   case 'TIME-ENDED':
    //     stopTimer()
    //     break
    //   default:
    //     stopTimer()
    // }
    // return () => stopTimer()
  }, [gameState, params.roomId, timeRemaining])

  // const timer = useRef<string | number | NodeJS.Timeout | undefined>(0)

  // if (timeRemaining <= 0) clearInterval(timer.current)

  // function startTimer() {
  //   timer.current = setInterval(() => {
  //     setTimeRemaining(prev => prev - 1)
  //   }, 1000)
  // }

  // function stopTimer() {
  //   if (!timer.current) return
  //   clearInterval(timer.current)
  //   timer.current = 0
  // }

  return (
    <div className="ml-auto">
      <CountdownCircleTimer
        strokeWidth={6}
        strokeLinecap={'round'}
        size={80}
        isPlaying={isPlaying}
        duration={timeRemaining}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[60, 45, 30, 15]}
        onComplete={() => ({ shouldRepeat: true, delay: 1 })}
      >
        {renderTime}
      </CountdownCircleTimer>
    </div>
  )
}
export default Clock
