import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import UserInfo from '../../../components/ui/UserInfo'
import { AuthContext } from '../../../context/AuthContext'
import { RoundsData, UpdateScoreData } from '../../../lib/types'
import { getSum } from '../../../utils/helpers'
import { updateScoresData } from '../../GameCreation/utils/http'
import { getScoringData } from '../utils/helpers'
import AnswersList from './AnswersList'

const CategoryScores = () => {
  const [scores, setScores] = useState<Record<string, number> | null>(null)

  const { roundData } = useLoaderData() as {
    roundData: RoundsData
    // userInfo: PlayerData[]
  }
  const currentUser = useContext(AuthContext)
  const params = useParams()

  const currentRound = roundData.currentRound

  // Make initial scores object
  useEffect(() => {
    if (roundData && scores === null) {
      const initialScores = Object.fromEntries(
        roundData.roundsConfig[currentRound - 1]?.activeCategories!.map(
          item => [item, 0]
        )
      )
      setScores(initialScores)
    }
  }, [roundData, currentRound, scores])

  // Object that contains user to correct and other users
  const scoringData: ReturnType<typeof getScoringData> = useMemo(() => {
    return getScoringData(roundData, currentRound, currentUser?.uid)
  }, [currentUser?.uid, roundData, currentRound])

  //state for radio buttons
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
    const scoreData: UpdateScoreData = {
      scoresCategory: scores,
      roundScore,
      scoreRounds:
        roundData?.currentRound === 1
          ? [roundScore]
          : [
              ...roundData!.scores[scoringData!.userIdToCorrect].scoreRounds,
              roundScore,
            ],

      currentRound: roundData?.currentRound,
    }

    await updateScoresData(
      params.roomId!,
      scoringData!.userIdToCorrect,
      scoreData
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {!scoringData && 'Loading....'}
        {scoringData &&
          // Answers to correct
          Object.entries(scoringData.answersToCorrect).map(category => {
            //[Category,Answer]

            return (
              <div className="border-2 border-lime-700" key={category[0]}>
                <h2 className="text-center">{category[0]}</h2>
                <div className="inline-flex flex-col">
                  <UserInfo
                    userId={scoringData.userIdToCorrect}
                    // users={userInfo}
                  />
                  <AnswersList answers={category[1]} />
                  <div className="inline-flex flex-col border-2 border-red-700">
                    {scoringData.otherUsers.map(user => (
                      //[UserId,Answers]
                      <Fragment key={user[0] + category[0]}>
                        <UserInfo
                          userId={user[0]}
                          // users={userInfo}
                        />
                        <AnswersList answers={user[1][category[0]]} />
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
            )
          })}
      </div>
      <button type="button" onClick={handleScoring}>
        Submit
      </button>
    </>
  )
}
export default CategoryScores
