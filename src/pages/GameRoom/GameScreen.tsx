import { LoaderFunction, useLoaderData } from 'react-router-dom'
import { GameScreenRoundsData, GameSettings } from '../../lib/types'
import { fetchLobbyData } from '../../utils/fetchData'

import { H1 } from '@/components/typography/Headings'
import GameHeader from '@/components/ui/GameHeader'
import { currentAlphabetAtom } from '@/context/atoms'
import useNextPhase from '@/hooks/useNextPhase'
import { getCurrentRoundConfig } from '@/utils/helpers'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import Clock from './components/Clock'

import CurrentAlphabet from '@/components/CurrentAlphabet'
import AnswerCards from './components/AnswerCards'

const GameScreen = () => {
  const { settings, roundsData } = useLoaderData() as {
    settings: GameSettings
    roundsData: GameScreenRoundsData
  }

  const { data: gameData } = useNextPhase()

  const [currentAlphabet, setCurrentAlphabet] = useAtom(currentAlphabetAtom)

  useEffect(() => {
    if (roundsData) {
      const currentAlphabet = getCurrentRoundConfig(roundsData).alphabet
      setCurrentAlphabet(currentAlphabet)
    }
  }, [roundsData, setCurrentAlphabet])

  return (
    <section className="flex flex-col flex-1 my-6 ">
      <GameHeader roundsData={roundsData}>
        <Clock
          roundTime={5}
          gameState={gameData?.gameState}
          currentRound={roundsData?.currentRound}
        />
      </GameHeader>
      <article className="px-4 basis-full bg-bg-primary">
        <div className="flex items-center justify-between pt-6 pb-8 md:pb-12 lg:pb-16 lg:pt-8">
          <H1>
            Round {roundsData?.currentRound}/{roundsData?.roundsConfig.length}
          </H1>
          <CurrentAlphabet currentAlphabet={currentAlphabet} />
        </div>
        <AnswerCards gameData={gameData} />
      </article>
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
