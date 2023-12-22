import { FireStoreError, GameData } from '../lib/types'
import { useOnSnapShot } from './useOnSnapShot'

const useNextPhase = () => {
  const { data } = useOnSnapShot({
    docRef: 'gameRooms',
    roomId,
  }) as { data: GameData | undefined; error: FireStoreError }

  useEffect(() => {
    data?.gameState === 'ROUND-ENDED' && navigate('scoring')
  }, [data?.gameState, navigate])
}

export default useNextPhase
