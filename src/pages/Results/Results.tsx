import AlphabetsScroll from '@/components/ui/AlphabetsScroll'
import useNextPhase from '@/hooks/useNextPhase'
import { GameSettings, RoundsData } from '@/lib/types'
import { sortScore } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { LoaderFunction, useParams } from 'react-router-dom'
import { fetchLobbyData, queryClient } from '../../utils/fetchData'
import GameEndModal from './components/GameEndModal'
import ResultSkeleton from './components/ResultSkeleton'
import ResultsFooter from './components/ResultsFooter'
import ResultsTable from './components/ResultsTable'

const Results = () => {
  const { data: gameState } = useNextPhase()

  const { roomId } = useParams() as { roomId: string }

  const { data: roundsData, isFetching } = useQuery({
    queryKey: ['roundsData', roomId, 'results'],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<RoundsData>(queryKey[1], 'rounds'),
  })

  const { data: settings, isFetching: isFetchingLobbies } = useQuery({
    queryKey: ['lobbies', roomId],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<GameSettings>(queryKey[1], 'lobbies'),
  })

  const scoresData = useMemo(
    () => sortScore(roundsData?.scores),
    [roundsData?.scores]
  )

  const isLastRound =
    roundsData?.currentRound === settings?.settings.rounds.value

  return (
    <section className="flex flex-col justify-between flex-1 my-6 bg-bg-primary">
      {isFetching || isFetchingLobbies || !gameState ? (
        <ResultSkeleton />
      ) : (
        <>
          {gameState?.gameState === 'INIT' && (
            <AlphabetsScroll gameState={gameState} />
          )}
          {isLastRound && (
            <GameEndModal
              scoresData={scoresData}
              isLastRound={isLastRound}
              gameState={gameState}
            />
          )}

          <>
            <ResultsTable
              bonusPoints={gameState?.bonusPoints}
              scoresData={scoresData!}
              isLastRound={isLastRound}
              currentRound={roundsData!.currentRound}
              endMode={settings!.settings.endMode.value}
            />
            <ResultsFooter
              hostId={settings!.hostId}
              isLastRound={isLastRound}
            />
          </>
        </>
      )}
    </section>
  )
}
export default Results

// eslint-disable-next-line react-refresh/only-export-components
export const loader: LoaderFunction = async ({ params }) => {
  const roundsData = queryClient.fetchQuery({
    queryKey: ['roundsData', params.roomId!, 'results'],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<RoundsData>(queryKey[1], 'rounds'),
  })

  const settings = queryClient.fetchQuery({
    queryKey: ['lobbies', params.roomId!],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<GameSettings>(queryKey[1], 'lobbies'),
  })

  return { roundsData, settings }
}
