import { useCallback, useEffect } from 'react'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { GameState } from '../lib/types'
import { useOnSnapShot } from './useOnSnapShot'
import { queryClient } from '@/utils/fetchData'

const useNextPhase = (currentRound?: number) => {
  const navigate = useNavigate()
  const params = useParams()
  const matchScoringPath = useMatch(`game/${params.roomId}/scoring`)

  const { data, error } = useOnSnapShot<GameState | undefined>({
    docRef: 'gameRooms',
    roomId: params.roomId,
  })

  const invalidateRoundsData = useCallback(async () => {
    try {
      await queryClient.invalidateQueries({
        queryKey: ['roundsData', params.roomId!],
      })
    } catch (error) {
      throw new Error('Something went wrong!')
    }
  }, [params.roomId])

  useEffect(() => {
    if (!data?.gameState) return
    switch (data?.gameState) {
      case 'STARTED':
        // invalidateRoundsData()
        navigate(`../game`)
        break
      case 'SCORING':
        invalidateRoundsData()
        // if (matchScoringPath) return
        window.sessionStorage.clear()
        navigate('../scoring')
        break
      case 'RESULT':
        invalidateRoundsData()
        navigate('../result')
        break
      case 'CANCELLED':
        navigate('/')
        break
    }
  }, [
    invalidateRoundsData,
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
