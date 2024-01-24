import { GameScreenRoundsData, GameSettings, RoundsData } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { fetchLobbyData } from '../../utils/fetchData'
import ResultsFooter from './components/ResultsFooter'
import ResultsTable from './components/ResultsTable'
import { useMemo, useState } from 'react'
import AlphabetsScroll from '@/components/ui/AlphabetsScroll'
import { Dialog } from '@/components/ui/dialog'
import GameEndModal from './components/GameEndModal'
import useNextPhase from '@/hooks/useNextPhase'
import { sortScore } from '@/utils/helpers'

const Results = () => {
  const [queryEnabled, setQueryEnabled] = useState(true)
  const { data: gameState } = useNextPhase()

  const { roomId } = useParams() as { roomId: string }

  const { data: roundsData } = useQuery({
    queryKey: ['roundsData', roomId],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<RoundsData | GameScreenRoundsData>(queryKey[1], 'rounds'),
    enabled: queryEnabled,
  })

  console.log(queryEnabled, roundsData?.currentRound)

  const { data: settings } = useQuery({
    queryKey: ['lobbies', roomId],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<GameSettings>(queryKey[1], 'lobbies'),
    enabled: queryEnabled,
  })

  const scoresData = useMemo(
    () => sortScore(roundsData?.scores),
    [roundsData?.scores]
  )

  const isLastRound =
    roundsData?.currentRound === settings?.settings.rounds.value

  console.log(isLastRound)

  return (
    <section className="flex flex-col justify-between flex-1 my-6 bg-bg-primary">
      {gameState?.gameState === 'INIT' && (
        <AlphabetsScroll gameState={gameState} />
      )}

      <GameEndModal
        scoresData={scoresData}
        isLastRound={isLastRound}
        gameState={gameState}
      />

      {roundsData && settings && (
        <>
          <ResultsTable
            scoresData={scoresData!}
            isLastRound={isLastRound}
            currentRound={roundsData.currentRound}
          />
          <ResultsFooter
            hostId={settings?.hostId}
            isLastRound={isLastRound}
            setQueryEnabled={setQueryEnabled}
          />
        </>
      )}
    </section>
  )
}
export default Results
