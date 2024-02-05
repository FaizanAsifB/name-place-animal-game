import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { GameState } from '../lib/types'
import { useOnSnapShot } from './useOnSnapShot'

const useNextPhase = (currentRound?: number) => {
  const navigate = useNavigate()
  const params = useParams()

  const { data, error } = useOnSnapShot<GameState | undefined>({
    docRef: 'gameRooms',
    roomId: params.roomId,
  })

  useEffect(() => {
    if (!data?.gameState) return
    switch (data?.gameState) {
      case 'STARTED':
        navigate(`../game`, { replace: true })
        break
      case 'SCORING':
        toast.dismiss()
        navigate('../scoring', { replace: true })
        break
      case 'RESULT':
        toast.dismiss()
        window.sessionStorage.clear()
        navigate('../result', { replace: true })
        break
      case 'CANCELLED':
        navigate('/', { replace: true })
        break
    }
  }, [
    currentRound,
    data?.gameState,
    data?.scoresSubmitted,
    data?.totalPlayers,
    navigate,
    params.roomId,
  ])
  return { params, data, fireStoreError: error }
}

export default useNextPhase
