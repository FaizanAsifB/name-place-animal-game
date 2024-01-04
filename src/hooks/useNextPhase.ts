import { useEffect } from 'react'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { FireStoreError, GameState } from '../lib/types'
import { useOnSnapShot } from './useOnSnapShot'

const useNextPhase = (currentRound?: number) => {
  const navigate = useNavigate()
  const params = useParams()
  const matchScoringPath = useMatch(`game/${params.roomId}/scoring`)

  const { data, error } = useOnSnapShot({
    docRef: 'gameRooms',
    roomId: params.roomId,
  }) as { data: GameState | undefined; error: FireStoreError }

  useEffect(() => {
    if (!data?.gameState) return
    switch (data?.gameState) {
      case 'INIT':
        navigate(`/game/${params.roomId!}`)
        break
      case 'SCORING':
        if (matchScoringPath) return
        navigate('scoring')
        break
      case 'RESULT':
        navigate('../result')
        break
    }
  }, [
    currentRound,
    data?.gameState,
    data?.scoresSubmitted,
    data?.totalPlayers,
    matchScoringPath,
    navigate,
    params.roomId,
  ])
  return { params, data, fireStoreError: error }
}

export default useNextPhase
