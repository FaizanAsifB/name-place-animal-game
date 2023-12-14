import { useContext, useEffect, useMemo } from 'react'
import { LoaderFunction, useLoaderData } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { GameData } from '../../lib/types'
import { fetchLobbyData } from '../../utils/fetchData'

const Scoring = () => {
  const { gameData } = useLoaderData() as { gameData: GameData }
  const currentUser = useContext(AuthContext)

  const scoringData = useMemo(() => {
    if (!gameData) return
    const answers = gameData.answers[`round${gameData.currentRound}`]
    const currentUserIndex = answers.findIndex(
      item => Object.keys(item)[0] === currentUser?.uid
    )

    const indexToCorrect = answers.length - currentUserIndex - 1
    const userToCorrect = Object.entries(answers[indexToCorrect])[0]
    const userIdToCorrect = userToCorrect[0]
    const answersToCorrect = userToCorrect[1]
    return { userId: userIdToCorrect, answersToCorrect }
  }, [currentUser?.uid, gameData])
  console.log(scoringData)

  useEffect(() => {}, [currentUser?.uid, gameData, scoringData])

  return (
    <div>
      Scoring
      <ul>
        {!scoringData && 'Loading....'}
        {scoringData &&
          Object.entries(scoringData.answersToCorrect).map(category => (
            <li key={category[0]}>
              <h2>{category[0]}</h2>
              <ul>
                {category[1].map((answer, index) => (
                  <li key={category[0] + category[1] + index}>
                    answer={answer}
                  </li>
                ))}
              </ul>
            </li>
          ))}
      </ul>
    </div>
  )
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
