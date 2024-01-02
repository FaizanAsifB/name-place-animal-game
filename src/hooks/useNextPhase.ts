import { updateGameState } from '@/pages/GameCreation/utils/http'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FireStoreError, GameState } from '../lib/types'
import { useOnSnapShot } from './useOnSnapShot'

const useNextPhase = () => {
  // roomId: string
  const navigate = useNavigate()
  const params = useParams()

  const { data, error } = useOnSnapShot({
    docRef: 'gameRooms',
    roomId: params.roomId,
  }) as { data: GameState | undefined; error: FireStoreError }

  useEffect(() => {
    async function navigateToResult() {
      await updateGameState('RESULT', params.roomId!)
      navigate('../result')
    }
    if (!data?.gameState) return
    switch (data?.gameState) {
      case 'INIT':
        navigate(`/game/${params.roomId!}`)
        break
      case 'ROUND-ENDED':
        navigate('scoring')
        break
      case 'SCORING':
        if (
          data.scoresSubmitted?.[`round${data.currentRound}`] ===
          data.totalPlayers
        )
          navigateToResult()
        break
    }
  }, [
    data?.gameState,
    navigate,
    params.roomId,
    data?.currentRound,
    data?.scoresSubmitted,
    data?.totalPlayers,
  ])
  return { params, data, fireStoreError: error }
}

export default useNextPhase
