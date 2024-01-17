import AlphabetsScroll from '@/components/ui/AlphabetsScroll'
import { Button } from '@/components/ui/button'
import useNextPhase from '@/hooks/useNextPhase'
import { GameSettings, RoundsData } from '@/lib/types'
import { ArrowRightCircle, Home } from 'lucide-react'
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
    await updateCurrentRound(params.roomId!)
    await updateGameState('INIT', params.roomId!)
  }

  // const { error } =
  const { data: gameState } = useNextPhase()

  const isLastRound = roundsData?.currentRound === totalRounds

  return (
    <section className="flex flex-col justify-between flex-1 my-6 bg-bg-primary">
      <ResultsTable roundsData={roundsData} isLastRound={isLastRound} />
      {!isLastRound ? (
        <Button
          type="button"
          className="mx-auto my-6"
          onClick={handleNextRound}
        >
          <ArrowRightCircle /> Next Round
        </Button>
      ) : (
        <Button asChild className="mx-auto my-6 ">
          <Link to={'/'}>
            {' '}
            <Home />
            Exit Game
          </Link>
        </Button>
      )}
      {gameState?.gameState === 'INIT' && (
        <AlphabetsScroll gameState={gameState} />
      )}
    </section>
  )
}
export default Results

// eslint-disable-next-line react-refresh/only-export-components
export const loader: LoaderFunction = async ({ params }) => {
  const roundsData = await fetchLobbyData<RoundsData>(params.roomId!, 'rounds')
  const settings = await fetchLobbyData<GameSettings>(params.roomId!, 'lobbies')

  return { roundsData, totalRounds: settings?.settings.rounds.value }
}
