import { useEffect, useRef, useState } from 'react'
import { GameState } from '../../../lib/types'

type ClockProps = {
  gameState: GameState
  roundTime: number
}

const Clock = ({ gameState, roundTime }: ClockProps) => {
  const [timeRemaining, setTimeRemaining] = useState(roundTime)
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  const timer = useRef<string | number | NodeJS.Timeout | undefined>(0)

  if (timeRemaining <= 0) clearInterval(timer.current)

  function startTimer() {
    timer.current = setInterval(() => {
      setTimeRemaining(prev => prev - 1)
    }, 1000)
  }

  function stopTimer() {
    clearInterval(timer.current)
    timer.current = 0
  }

  useEffect(() => {
    if (gameState === 'INIT') return
    if (gameState === 'STARTED') startTimer()
    if (gameState === 'END-TIMER') {
      setTimeRemaining(15)
      startTimer()
    }
    if (gameState === 'ROUND-ENDED') stopTimer()
    return () => stopTimer()
  }, [gameState])

  return (
    <div>
      min:{minutes.toString().padStart(2, '0')} sec:
      {seconds.toString().padStart(2, '0')}
    </div>
  )
}
export default Clock
