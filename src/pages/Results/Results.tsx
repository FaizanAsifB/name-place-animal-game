import { GameSettings, RoundsData } from '@/lib/types'
import { LoaderFunction, useLoaderData } from 'react-router-dom'
import { fetchLobbyData } from '../../utils/fetchData'
import ResultsFooter from './components/ResultsFooter'
import ResultsTable from './components/ResultsTable'

const Results = () => {
  const { roundsData, settings } = useLoaderData() as {
    roundsData: RoundsData
    settings: GameSettings
  }

  // const { error } =

  const isLastRound =
    roundsData?.currentRound === settings?.settings.rounds.value

  return (
    <section className="flex flex-col justify-between flex-1 my-6 bg-bg-primary">
      <ResultsTable roundsData={roundsData} isLastRound={isLastRound} />
      <ResultsFooter hostId={settings?.hostId} isLastRound={isLastRound} />
    </section>
  )
}
export default Results

// eslint-disable-next-line react-refresh/only-export-components
export const loader: LoaderFunction = async ({ params }) => {
  const roundsData = await fetchLobbyData<RoundsData>(params.roomId!, 'rounds')
  const settings = await fetchLobbyData<GameSettings>(params.roomId!, 'lobbies')

  return { roundsData, settings }
}
