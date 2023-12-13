import { useEffect, useState } from 'react'
import { LoaderFunction, useLoaderData, useParams } from 'react-router-dom'

import { GameData, GameSettings, GameState } from '../../lib/types'
import { fetchLobbyData } from '../../utils/fetchData'

import { useOnSnapShot } from '../../hooks/useOnSnapShot'
import { updateGameState } from '../GameCreation/utils/http'
import CategoryInputs from './components/CategoryInputs'
import Clock from './components/Clock'

const GameRoom = () => {
  const [activeAlphabet, setActiveAlphabet] = useState<string | null>(null)

  const { settings, gameData } = useLoaderData() as {
    settings: GameSettings
    gameData: GameData
  }

  useEffect(() => {
    setActiveAlphabet(gameData.rounds[gameData.currentRound - 1].alphabet)
  }, [gameData.currentRound, gameData.rounds])

  return (
    <div>
      <div className="flex justify-end gap-4">
        <Clock roundTime={settings.settings.roundTime} />
        <div>{activeAlphabet}</div>
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
