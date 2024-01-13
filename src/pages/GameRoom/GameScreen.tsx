import { LoaderFunction, useLoaderData } from 'react-router-dom'
import { GameScreenRoundsData, GameSettings } from '../../lib/types'
import { fetchLobbyData } from '../../utils/fetchData'

import { H1, H2 } from '@/components/typography/Headings'
import GameHeader from '@/components/ui/GameHeader'
import { currentAlphabetAtom } from '@/context/atoms'
import useNextPhase from '@/hooks/useNextPhase'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import AlphabetsScroll from './components/AlphabetsScroll'
import AnswersInput from './components/AnswersInput'
import Clock from './components/Clock'

const GameScreen = () => {
  const { settings, roundsData } = useLoaderData() as {
    settings: GameSettings
    roundsData: GameScreenRoundsData
  }

  const { data: gameData } = useNextPhase()

  const [currentAlphabet, setCurrentAlphabet] = useAtom(currentAlphabetAtom)

  useEffect(() => {
    setCurrentAlphabet(
      roundsData?.roundsConfig[roundsData?.currentRound - 1].alphabet
    )
  }, [roundsData?.currentRound, roundsData?.roundsConfig, setCurrentAlphabet])

  return (
    <section className="mt-6 rounded-lg bg-bg-primary ">
      <GameHeader roundsData={roundsData}>
        <Clock
          roundTime={settings?.settings.roundTime.value}
          gameState={gameData?.gameState}
        />
      </GameHeader>
      <AlphabetsScroll gameState={gameData?.gameState} />
      <div className="px-4 py-5 ">
        <div className="flex items-center justify-between">
          <H2>{currentAlphabet}</H2>
          <H1 className="mb-6">
            Round {roundsData?.currentRound}/{roundsData?.roundsConfig.length}
          </H1>
        </div>
        <AnswersInput gameData={gameData} />
      </div>
    </section>
  )
}
export default GameScreen

// eslint-disable-next-line react-refresh/only-export-components
export const loader: LoaderFunction = async ({ params }) => {
  const roundsData = await fetchLobbyData(params.roomId!, 'rounds')
  const settings = await fetchLobbyData(params.roomId!, 'lobbies')

  return { roundsData, settings }
}
