import {
  LoaderFunction,
  useLoaderData,
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  CreateGameData,
  FireStoreError,
  GameData,
  GameSettings,
} from '../../lib/types'
import { fetchLobbyData } from '../../utils/fetchData'

import { useEffect } from 'react'
import { useOnSnapShot } from '../../hooks/useOnSnapShot'
import Clock from './components/Clock'
import Answers from './components/Answers'

const GameRoom = () => {
  const { settings, roundsData } = useLoaderData() as {
    settings: GameSettings
    roundsData: CreateGameData
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
          {roundsData
            ? roundsData?.roundsConfig[roundsData?.currentRound - 1].alphabet
            : 'loading.....'}
        </div>
      </div>
      <Answers />
    </div>
  )
}
export default GameRoom

export const loader: LoaderFunction = async ({ params }) => {
  const roundsData = await fetchLobbyData(params.roomId!, 'rounds')
  const settings = await fetchLobbyData(params.roomId!, 'lobbies')

  return { roundsData, settings }

  // return queryClient.fetchQuery({
  //   queryKey: ['events', params.id],
  //   queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  // })
}
