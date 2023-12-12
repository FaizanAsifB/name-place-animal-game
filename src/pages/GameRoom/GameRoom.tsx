import { useEffect, useState } from 'react'
import Countdown from 'react-countdown'
import { alphabets } from './components/util/utils'
import { fetchLobbyData } from '../../utils/fetchData'
import { LoaderFunction, useLoaderData } from 'react-router-dom'
// import AlphabetsScroll from './components/AlphabetsScroll'

const GameRoom = () => {
  const [activeAlphabet, setActiveAlphabet] = useState<string | null>(null)

  const { categoriesData, playersData } = useLoaderData()
  console.log(categoriesData, playersData)

  useEffect(() => {
    setActiveAlphabet(gameInit())
  }, [])

  function gameInit(): string {
    //Start alphabets scroll
    // Choose alphabet
    const i = Math.floor(Math.random() * 26)
    const activeAlphabet = alphabets[i]
    //start timer?
    return activeAlphabet
  }

  return (
    <div>
      GameRoom
      <div className="flex justify-end gap-4">
        <Countdown date={Date.now() + 10000} />
        <div>{activeAlphabet}</div>
      </div>
    </div>
  )
}
export default GameRoom

export const loader: LoaderFunction = async ({ params }) => {
  const playersData = await fetchLobbyData(params.roomId!, 'lobbyPlayers')
  const categoriesData = await fetchLobbyData(params.roomId!, 'categories')

  return { playersData, categoriesData }

  // return queryClient.fetchQuery({
  //   queryKey: ['events', params.id],
  //   queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  // })
}
