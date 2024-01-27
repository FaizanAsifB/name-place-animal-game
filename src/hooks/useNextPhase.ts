import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GameState } from '../lib/types'
import { useOnSnapShot } from './useOnSnapShot'
import { toast } from 'sonner'

const useNextPhase = (currentRound?: number) => {
  const navigate = useNavigate()
  const params = useParams()
  // const matchScoringPath = useMatch(`game/${params.roomId}/scoring`)

  const { data, error } = useOnSnapShot<GameState | undefined>({
    docRef: 'gameRooms',
    roomId: params.roomId,
  })

  // const invalidateRoundsData = useCallback(async () => {
  //   try {
  //     await queryClient.invalidateQueries({
  //       queryKey: ['roundsData', params.roomId!],
  //     })
  //   } catch (error) {
  //     throw new Error('Something went wrong!')
  //   }
  // }, [params.roomId])

  useEffect(() => {
    if (!data?.gameState) return
    switch (data?.gameState) {
      case 'STARTED':
        navigate(`../game`)
        break
      case 'SCORING':
        // if (matchScoringPath) return
        navigate('../scoring')
        break
      case 'RESULT':
        toast.dismiss()
        window.sessionStorage.clear()
        // invalidateRoundsData()
        navigate('../result')
        break
      case 'CANCELLED':
        navigate('/')
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
