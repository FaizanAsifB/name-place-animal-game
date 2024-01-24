import AlphabetsScroll from '@/components/ui/AlphabetsScroll'
import useNextPhase from '@/hooks/useNextPhase'
import { GameScreenRoundsData, GameSettings, RoundsData } from '@/lib/types'
import { sortScore } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { fetchLobbyData } from '../../utils/fetchData'
import GameEndModal from './components/GameEndModal'
import ResultsFooter from './components/ResultsFooter'
import ResultsTable from './components/ResultsTable'

const Results = () => {
  const { data: gameState } = useNextPhase()

  const { roomId } = useParams() as { roomId: string }

  const { data: roundsData } = useQuery({
    queryKey: ['roundsData', roomId],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<RoundsData | GameScreenRoundsData>(queryKey[1], 'rounds'),
  })

  const { data: settings } = useQuery({
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
      {gameState?.gameState === 'INIT' && (
        <AlphabetsScroll gameState={gameState} />
      )}
      {isLastRound && scoresData && (
        <GameEndModal
          scoresData={scoresData}
          isLastRound={isLastRound}
          gameState={gameState}
        />
      )}
      {roundsData && settings && (
        <>
          <ResultsTable
            scoresData={scoresData!}
            isLastRound={isLastRound}
            currentRound={roundsData.currentRound}
          />
          <ResultsFooter hostId={settings?.hostId} isLastRound={isLastRound} />
        </>
      )}
    </section>
  )
}
export default Results
