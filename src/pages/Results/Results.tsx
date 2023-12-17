import { LoaderFunction, useNavigate, useParams } from 'react-router-dom'

import { useEffect } from 'react'
import { useOnSnapShot } from '../../hooks/useOnSnapShot'
import { fetchLobbyData } from '../../utils/fetchData'
import { updateCurrentRound, updateGameState } from '../GameCreation/utils/http'
import ResultsTable from './components/ResultsTable'

const Results = () => {
  const params = useParams()

  const { data } = useOnSnapShot({
    docRef: 'gameRooms',
    roomId: params?.roomId,
  })

  const navigate = useNavigate()

  function handleNextRound() {
    updateCurrentRound(params.roomId!)
    updateGameState('INIT', params.roomId!)
  }

  useEffect(() => {
    if (data && data.gameState === 'INIT') navigate(`/game/${params.roomId}`)
    // ../game/:${params.roomId}
  }, [data, navigate, params.roomId])
  return (
    <div>
      <h1>Results</h1>
      <ResultsTable />

      <button type="button" onClick={handleNextRound}>
        Next Round
      </button>
    </div>
  )
}
export default Results

export const loader: LoaderFunction = async ({ params }) => {
  const gameData = await fetchLobbyData(params.roomId!, 'gameRooms')

  return { gameData }

  // return queryClient.fetchQuery({
  //   queryKey: ['events', params.id],
  //   queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  // })
}
