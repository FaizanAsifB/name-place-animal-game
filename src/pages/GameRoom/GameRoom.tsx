import { useEffect, useState } from 'react'
import { LoaderFunction } from 'react-router-dom'

import { fetchLobbyData } from '../../utils/fetchData'
import CategoryInputs from './components/CategoryInputs'
import Clock from './components/Clock'
import { alphabets } from './components/util/utils'

const GameRoom = () => {
  const [activeAlphabet, setActiveAlphabet] = useState<string | null>(null)

  const [timerActive, setTimerActive] = useState(false)

  useEffect(() => {
    // setActiveAlphabet(gameInit())
    setTimerActive(true)
  }, [])

  // function gameInit(): string {
  //   //Start alphabets scroll
  //   // Choose alphabet
  //   const i = Math.floor(Math.random() * 26)
  //   const activeAlphabet = alphabets[i]
  //   //start timer?

  //   return activeAlphabet
  // }

  return (
    <div>
      GameRoom
      <div className="flex justify-end gap-4">
        <Clock activated={timerActive} />

        {/* <Countdown date={Date.now() + 100000} /> */}
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
