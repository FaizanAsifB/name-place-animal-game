import { useEffect } from 'react'
import { LoaderFunction, useNavigate, useParams } from 'react-router-dom'

import { useOnSnapShot } from '../../hooks/useOnSnapShot'
import { GameData } from '../../lib/types'
import { fetchLobbyData } from '../../utils/fetchData'

import { updateGameState } from '../GameCreation/utils/http'
import CategoryAnswers from './components/CategoryAnswers'

const Scoring = () => {
  const params = useParams()
  const { data } = useOnSnapShot({
    docRef: 'gameRooms',
    roomId: params.roomId!,
  }) as { data: GameData }

  const navigate = useNavigate()

  useEffect(() => {
    async function navigateToResult() {
      await updateGameState('RESULT', params.roomId!)
      navigate('../result')
    }
    if (
      data &&
      data.scoresSubmitted?.[`round${data.currentRound}`] === data.totalPlayers
    )
      navigateToResult()
  }, [data, navigate, params.roomId])

  return <CategoryAnswers />
}
export default Scoring

export const loader: LoaderFunction = async ({ params }) => {
  const gameData = await fetchLobbyData(params.roomId!, 'gameRooms')

  return { gameData }

  // return queryClient.fetchQuery({
  //   queryKey: ['events', params.id],
  //   queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  // })
}
