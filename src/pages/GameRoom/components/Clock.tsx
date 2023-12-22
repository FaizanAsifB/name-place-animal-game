import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useOnSnapShot } from '../../../hooks/useOnSnapShot'
import { GameState } from '../../../lib/types'
import { updateGameState } from '../../GameCreation/utils/http'

type ClockProps = {
  roundTime: number
}

const Clock = ({ roundTime }: ClockProps) => {
  const [timeRemaining, setTimeRemaining] = useState(80000)
  const params = useParams()

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  const { data: gameData } = useOnSnapShot({
    docRef: 'gameRooms',
    roomId: params.roomId!,
  })

  const gameState: GameState = gameData?.gameState || 'INIT'
  if (timeRemaining === 0 && gameState !== 'ROUND-ENDED')
    updateGameState('ROUND-ENDED', params.roomId!)

  useEffect(() => {
    switch (gameState) {
      case 'INIT':
        updateGameState('STARTED', params.roomId!)
        break
      case 'STARTED':
        startTimer()
        break
      case 'END-TIMER':
        {
          setTimeRemaining(15)
          startTimer()
        }
        break
      case 'ROUND-ENDED':
        stopTimer()
        break
      default:
        stopTimer()
    }
    return () => stopTimer()
  }, [gameState, params.roomId])

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

  return (
    <div>
      min:{minutes.toString().padStart(2, '0')} sec:
      {seconds.toString().padStart(2, '0')}
    </div>
  )
}
export default Clock
