import {
  LoaderFunction,
  useLoaderData,
  useNavigate,
  useParams,
} from 'react-router-dom'

import { FireStoreError, GameData, GameSettings } from '../../lib/types'
import { fetchLobbyData } from '../../utils/fetchData'

import { useEffect } from 'react'
import { useOnSnapShot } from '../../hooks/useOnSnapShot'
import CategoryInputs from './components/CategoryInputs'
import Clock from './components/Clock'

const GameRoom = () => {
  // const [activeAlphabet, setActiveAlphabet] = useState<string | null>(null)

  const { settings, gameData } = useLoaderData() as {
    settings: GameSettings
    gameData: GameData
  }
  const params = useParams()
  const navigate = useNavigate()

  const { data } = useOnSnapShot({
    docRef: 'gameRooms',
    roomId: params.roomId!,
  }) as { data: GameData | undefined; error: FireStoreError }

  useEffect(() => {
    data?.gameState === 'ROUND-ENDED' && navigate('scoring')
  }, [data?.gameState, navigate])

  return (
    <div>
      <div className="flex justify-end gap-4">
        <Clock roundTime={settings?.settings.roundTime} />
        <div>
          {gameData
            ? gameData?.rounds[gameData?.currentRound - 1].alphabet
            : 'loading.....'}
        </div>
      </div>
      <CategoryInputs />
    </div>
  )
}
export default GameRoom

export const loader: LoaderFunction = async ({ params }) => {
  const gameData = await fetchLobbyData(params.roomId!, 'gameRooms')
  const settings = await fetchLobbyData(params.roomId!, 'lobbies')

  return { gameData, settings }

  // return queryClient.fetchQuery({
  //   queryKey: ['events', params.id],
  //   queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  // })
}
