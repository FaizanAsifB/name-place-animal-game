import { useNavigate } from 'react-router-dom'
import { FireStoreError, GameData } from '../lib/types'
import { useOnSnapShot } from './useOnSnapShot'

const useNextPhase = roomId => {
  const navigate = useNavigate()

  const { data } = useOnSnapShot({
    docRef: 'gameRooms',
    roomId,
  }) as { data: GameData | undefined; error: FireStoreError }

  useEffect(() => {
    data?.gameState === 'ROUND-ENDED' && navigate('scoring')
  }, [data?.gameState, navigate])
}

export default useNextPhase
