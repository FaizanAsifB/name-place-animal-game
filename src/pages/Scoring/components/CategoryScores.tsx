import { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import UserInfo from '../../../components/ui/UserInfo'
import { AuthContext } from '../../../context/AuthContext'
import { RoundsData, UpdateScoreData } from '../../../lib/types'
import { getSum, getUserInfo } from '../../../utils/helpers'
import { updateScoresData } from '../../GameCreation/utils/http'
import { getScoringData } from '../utils/helpers'
import AnswersList from './AnswersList'
import { useFetchPlayers } from '@/hooks/useFetchPlayers'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const CategoryScores = () => {
  const [scores, setScores] = useState<Record<string, number> | null>(null)

  const { roundData, roomId } = useLoaderData() as {
    roundData: RoundsData
    roomId: string
  }

  const { users, isError, error, isPending } = useFetchPlayers()

  const currentUser = useContext(AuthContext)
  // const params = useParams()
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
  function handleScores(category: string, newScore: string | null) {
    if (newScore !== null) {
      setScores(prev => {
        return { ...prev, [category]: +newScore }
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

    await updateScoresData(roomId, scoringData!.userIdToCorrect, scoreData)
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
                  {!isPending && (
                    <UserInfo
                      userId={scoringData.userIdToCorrect}
                      users={users}
                      // users={userInfo}
                    />
                  )}
                  <AnswersList answers={category[1]} />
                  <div className="inline-flex flex-col border-2 border-red-700">
                    {scoringData.otherUsers.map(user => (
                      //[UserId,Answers]
                      <Fragment key={user[0] + category[0]}>
                        {!isPending && (
                          <UserInfo userId={user[0]} users={users} />
                        )}
                        <AnswersList answers={user[1][category[0]]} />
                      </Fragment>
                    ))}
                  </div>
                </div>

                <ToggleGroup
                  value={`${scores?.[category[0]] ?? 0}`}
                  // exclusive
                  onValueChange={value => handleScores(...[category[0]], value)}
                  type="single"
                  aria-label="category scoring"
                >
                  <ToggleGroupItem
                    value={'0'}
                    aria-label="zero"
                    id={category[0]}
                  >
                    0
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value={'5'}
                    aria-label="five"
                    id={category[0]}
                  >
                    5
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value={'10'}
                    aria-label="ten"
                    id={category[0]}
                  >
                    10
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            )
          })}
      </div>
      <Button type="button" onClick={handleScoring}>
        Submit
      </Button>
    </>
  )
}
export default CategoryScores
