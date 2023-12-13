import { useEffect, useRef, useState } from 'react'
import { LoaderFunction, useLoaderData } from 'react-router-dom'

import { GameData, GameSettings, GameState } from '../../lib/types'
import { fetchLobbyData } from '../../utils/fetchData'

import CategoryInputs from './components/CategoryInputs'
import Clock from './components/Clock'

const GameRoom = () => {
  const [activeAlphabet, setActiveAlphabet] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState>('INIT')

  const { settings, gameData } = useLoaderData() as {
    settings: GameSettings
    gameData: GameData
  }

  useEffect(() => {
    setActiveAlphabet(gameData.rounds[gameData.currentRound - 1].alphabet)
  }, [gameData.currentRound, gameData.rounds])

  // function start() {
  //   setGameState('STARTED')
  // }
  // function stop() {
  //   setGameState('ROUND-ENDED')
  // }

  // function reset() {
  //   setGameState('END-TIMER')
  // }

  return (
    <div>
      <div className="flex justify-end gap-4">
        <Clock gameState={gameState} roundTime={settings.settings.roundTime} />
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
