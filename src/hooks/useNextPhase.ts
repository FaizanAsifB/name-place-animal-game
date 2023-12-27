import { useNavigate, useParams } from 'react-router-dom'
import { FireStoreError, PlayersData } from '../lib/types'
import { useOnSnapShot } from './useOnSnapShot'
import { useEffect } from 'react'

const useNextPhase = () => {
  // roomId: string
  const navigate = useNavigate()
  const params = useParams()

  const { data, error } = useOnSnapShot({
    docRef: 'lobbyPlayers',
    roomId: params.roomId,
  }) as { data: PlayersData | undefined; error: FireStoreError }

  useEffect(() => {
    if (!data?.gameState) return
    switch (data?.gameState) {
      case 'INIT':
        navigate(`/game/${params.roomId!}`)
        break
    }
    // data?.gameState === 'ROUND-ENDED' && navigate('scoring')
  }, [data?.gameState, navigate, params.roomId])
  return { params, data, fireStoreError: error }
}

export default useNextPhase
