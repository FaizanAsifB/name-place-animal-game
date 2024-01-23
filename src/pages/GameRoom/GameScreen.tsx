import { LoaderFunction, useParams } from 'react-router-dom'
import { GameScreenRoundsData, GameSettings, RoundsData } from '../../lib/types'
import { fetchLobbyData, queryClient } from '../../utils/fetchData'

import { H1 } from '@/components/typography/Headings'
import GameHeader from '@/components/ui/GameHeader'
import { currentAlphabetAtom } from '@/context/atoms'
import useNextPhase from '@/hooks/useNextPhase'
import { getCurrentRoundConfig } from '@/utils/helpers'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import Clock from './components/Clock'

import CurrentAlphabet from '@/components/ui/CurrentAlphabet'
import AnswerCards from './components/AnswerCards'
import { useQuery } from '@tanstack/react-query'

const GameScreen = () => {
  // const { settings, roundsData } = useLoaderData() as {
  //   settings: GameSettings
  //   roundsData: GameScreenRoundsData
  // }
  const params = useParams()

  const { data: roundsData } = useQuery({
    queryKey: ['roundsData', params.roomId],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<RoundsData | GameScreenRoundsData>(queryKey[1], 'rounds'),
  })

  const { data: settings } = useQuery({
    queryKey: ['lobbies', params.roomId],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<GameSettings>(queryKey[1], 'lobbies'),
  })

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
        {settings && roundsData && gameData && (
          <Clock
            roundTime={settings?.settings.roundTime.value}
            gameState={gameData?.gameState}
            currentRound={roundsData?.currentRound}
          />
        )}
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
  const roundsData = await queryClient.fetchQuery({
    queryKey: ['roundsData', params.roomId],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<RoundsData | GameScreenRoundsData>(queryKey[1], 'rounds'),
  })

  const settings = await queryClient.fetchQuery({
    queryKey: ['lobbies', params.roomId],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<GameSettings>(queryKey[1], 'lobbies'),
  })
  // const roundsData = await fetchLobbyData(params.roomId!, 'rounds')
  // const settings = await fetchLobbyData<GameSettings>(params.roomId!, 'lobbies')

  return { roundsData, settings }
}
