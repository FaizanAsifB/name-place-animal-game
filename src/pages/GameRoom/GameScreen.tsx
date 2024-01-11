import { LoaderFunction, useLoaderData } from 'react-router-dom'

import { CreateGameData, GameSettings } from '../../lib/types'
import { fetchLobbyData } from '../../utils/fetchData'

import AnswersInput from './components/AnswersInput'
import Clock from './components/Clock'
import AlphabetsScroll from './components/AlphabetsScroll'

const GameScreen = () => {
  const { settings, roundsData } = useLoaderData() as {
    settings: GameSettings
    roundsData: CreateGameData
  }

  const currentAlphabet =
    roundsData?.roundsConfig[roundsData?.currentRound - 1].alphabet

  return (
    <div>
      <AlphabetsScroll />
      <div className="flex justify-end gap-4">
        <Clock roundTime={settings?.settings.roundTime.value} />
        <div>{roundsData ? currentAlphabet : 'loading.....'}</div>
      </div>
      <AnswersInput />
    </div>
  )
}
export default GameScreen

// eslint-disable-next-line react-refresh/only-export-components
export const loader: LoaderFunction = async ({ params }) => {
  const roundsData = await fetchLobbyData(params.roomId!, 'rounds')
  const settings = await fetchLobbyData(params.roomId!, 'lobbies')

  return { roundsData, settings }
}
