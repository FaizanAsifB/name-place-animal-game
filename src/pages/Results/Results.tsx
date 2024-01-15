import { Button } from '@/components/ui/button'
import useNextPhase from '@/hooks/useNextPhase'
import { GameSettings, RoundsData } from '@/lib/types'
import {
  Link,
  LoaderFunction,
  useLoaderData,
  useParams,
} from 'react-router-dom'
import { fetchLobbyData } from '../../utils/fetchData'
import { updateCurrentRound, updateGameState } from '../GameCreation/utils/http'
import ResultsTable from './components/ResultsTable'

const Results = () => {
  const { roundsData, totalRounds } = useLoaderData() as {
    roundsData: RoundsData
    totalRounds: number
  }
  const params = useParams()

  async function handleNextRound() {
    //Todo setAlphabet to next round
    await updateCurrentRound(params.roomId!)
    await updateGameState('INIT', params.roomId!)
  }

  // const { error } =
  useNextPhase()

  const isLastRound = roundsData?.currentRound === totalRounds

  return (
    <div className="flex flex-col items-center justify-between h-full">
      <ResultsTable roundsData={roundsData} isLastRound={isLastRound} />
      {!isLastRound ? (
        <Button type="button" onClick={handleNextRound}>
          Next Round
        </Button>
      ) : (
        <Button asChild className="mb-4">
          <Link to={'/'}>Exit Game</Link>
        </Button>
      )}
    </div>
  )
}
export default Results

// eslint-disable-next-line react-refresh/only-export-components
export const loader: LoaderFunction = async ({ params }) => {
  const roundsData = await fetchLobbyData<RoundsData>(params.roomId!, 'rounds')
  const settings = await fetchLobbyData<GameSettings>(params.roomId!, 'lobbies')

  return { roundsData, totalRounds: settings.settings.rounds }
}
