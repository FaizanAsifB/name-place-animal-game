import { useEffect } from 'react'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { GameState } from '../lib/types'
import { useOnSnapShot } from './useOnSnapShot'

const useNextPhase = (currentRound?: number) => {
  const navigate = useNavigate()
  const params = useParams()
  const matchScoringPath = useMatch(`game/${params.roomId}/scoring`)

  const { data, error } = useOnSnapShot<GameState | undefined>({
    docRef: 'gameRooms',
    roomId: params.roomId,
  })

  useEffect(() => {
    if (!data?.gameState) return
    switch (data?.gameState) {
      case 'STARTED':
        navigate(`../game`)
        break
      case 'SCORING':
        if (matchScoringPath) return
        window.sessionStorage.clear()
        navigate('../scoring')
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
