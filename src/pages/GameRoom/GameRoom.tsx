import { useEffect, useState } from 'react'
import Countdown from 'react-countdown'
import { alphabets } from './components/util/utils'
import { fetchPlayers } from '../../utils/fetchData'
// import AlphabetsScroll from './components/AlphabetsScroll'

const GameRoom = () => {
  const [activeAlphabet, setActiveAlphabet] = useState<string | null>(null)

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

export const loader = async ({}) => {
  fetchPlayers(params.roomId)
}
