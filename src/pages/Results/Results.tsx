import { LoaderFunction } from 'react-router-dom'

import { fetchLobbyData } from '../../utils/fetchData'
import ResultsTable from './components/ResultsTable'

const Results = () => {
  return (
    <div>
      <h1>Results</h1>
      <ResultsTable />

      <button>Next Round</button>
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
