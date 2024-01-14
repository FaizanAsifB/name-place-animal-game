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
      roundsData?.roundsConfig[roundsData?.currentRound - 1]!.alphabet
    )
  }, [roundsData?.currentRound, roundsData?.roundsConfig, setCurrentAlphabet])

  return (
    <section className="flex flex-col flex-1 my-6 ">
      <GameHeader roundsData={roundsData}>
        <Clock
          roundTime={settings?.settings.roundTime.value}
          gameState={gameData?.gameState}
        />
      </GameHeader>
      <AlphabetsScroll gameState={gameData?.gameState} />
      <div className="px-4 rounded-lg basis-full bg-bg-primary">
        <div className="flex items-center justify-between pt-6 mb-8 md:mb-12 lg:mb-16 lg:pt-8">
          <H1>
            Round {roundsData?.currentRound}/{roundsData?.roundsConfig.length}
          </H1>
          <div className="grid w-12 h-12 border-4 rounded-full border-accent place-items-center">
            <H2>{currentAlphabet}</H2>
          </div>
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
