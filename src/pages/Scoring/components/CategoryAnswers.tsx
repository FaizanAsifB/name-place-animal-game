import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
import { GameData, UpdateScoreData } from '../../../lib/types'
import { getSum } from '../../../utils/helpers'
import { updateScoresData } from '../../GameCreation/utils/http'

const CategoryAnswers = () => {
  const [scores, setScores] = useState<Record<string, number> | null>(null)

  const { gameData } = useLoaderData() as { gameData: GameData }
  const currentUser = useContext(AuthContext)
  const params = useParams()

  useEffect(() => {
    if (gameData?.categories && scores === null) {
      const scores: Record<string, number> = {}
      gameData.categories.default
        .concat(gameData.categories.custom!)
        .forEach(item => {
          scores[item] = 0
        })
      setScores(scores)
    }
  }, [gameData?.categories, scores])

  const scoringData = useMemo(() => {
    if (!gameData) return
    const answers = gameData.answers[`round${gameData.currentRound}`]
    const currentUserIndex = answers.findIndex(
      item => Object.keys(item)[0] === currentUser?.uid
    )

    const indexToCorrect =
      currentUserIndex === answers.length - 1 ? 0 : currentUserIndex + 1

    const userToCorrect = Object.entries(answers[indexToCorrect])[0]

    const otherUsers = answers
      .filter((_, i) => i !== indexToCorrect)
      .map(item => {
        return Object.entries(item)[0]
      })

    const userIdToCorrect = userToCorrect[0]
    const answersToCorrect = userToCorrect[1]
    return { userId: userIdToCorrect, answersToCorrect, otherUsers }
  }, [currentUser?.uid, gameData])

  function handleScores(
    event: React.MouseEvent<HTMLElement>,
    newScore: string | null
  ) {
    if (newScore !== null) {
      setScores(prev => {
        return { ...prev, [event.currentTarget.id]: +newScore }
      })
    }
  }

  async function handleScoring() {
    const roundScore = getSum(Object.values(scores!))
    console.log(roundScore)
    const scoreData: UpdateScoreData = {
      scoresCategory: scores,
      roundScore,
      scoreRounds:
        gameData?.currentRound === 1
          ? [roundScore]
          : [...gameData!.scores[scoringData!.userId].scoreRounds, roundScore],

      currentRound: gameData?.currentRound,
    }

    await updateScoresData(params.roomId!, scoringData!.userId, scoreData)
  }
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {!scoringData && 'Loading....'}
        {scoringData &&
          Object.entries(scoringData.answersToCorrect).map(category => (
            <div className="border-2 border-lime-700" key={category[0]}>
              <h2 className="text-center">{category[0]}</h2>
              <div className="inline-flex flex-col">
                <p>{scoringData.userId.slice(-5)}</p>
                <ul className="flex gap-4 border-2 border-b-black">
                  {category[1].map((answer, index) => {
                    if (!answer) return
                    return (
                      <li key={category[0] + category[1] + index}>{answer}</li>
                    )
                  })}
                </ul>
                <div className="inline-flex flex-col border-2 border-red-700">
                  {scoringData.otherUsers.map((user, i) => (
                    <Fragment key={user[0] + i}>
                      <p>{user[0].slice(-5)}</p>
                      <ul className="flex gap-4">
                        {Object.entries(user[1])
                          .filter(item => item[0] === category[0])
                          .reduce((acc, item) => {
                            return acc.concat(item[1])
                          }, [] as string[])
                          .map((item, i) => {
                            if (!item) return
                            return (
                              <li className="flex" key={item + i}>
                                {item}
                              </li>
                            )
                          })}
                      </ul>
                    </Fragment>
                  ))}
                </div>
              </div>

              <ToggleButtonGroup
                value={scores?.[category[0]] ?? 0}
                exclusive
                onChange={handleScores}
                aria-label="category scoring"
              >
                <ToggleButton value={0} aria-label="zero" id={category[0]}>
                  0
                </ToggleButton>
                <ToggleButton value={5} aria-label="five" id={category[0]}>
                  5
                </ToggleButton>
                <ToggleButton value={10} aria-label="ten" id={category[0]}>
                  10
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          ))}
      </div>
      <button type="button" onClick={handleScoring}>
        Submit
      </button>
    </>
  )
}
export default CategoryAnswers
