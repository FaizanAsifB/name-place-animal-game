import { LoaderFunction, useLoaderData } from 'react-router-dom'

import { fetchLobbyData } from '../../utils/fetchData'

import UserInfo from '@/components/ui/UserInfo'
import { Button } from '@/components/ui/button'
import { AuthContext } from '@/context/AuthContext'
import useNextPhase from '@/hooks/useNextPhase'
import {
  FireStoreError,
  GameState,
  RoundsData,
  UpdateScoreData,
} from '@/lib/types'
import { getSum } from '@/utils/helpers'
import { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { updateGameState, updateScoresData } from '../GameCreation/utils/http'
import AnswersList from './components/AnswersList'
import ScoresToggleGroup from './components/CategoryScores'
import { getScoringData } from './utils/helpers'

const Scoring = () => {
  const [scores, setScores] = useState<Record<string, number> | null>(null)

  const currentUser = useContext(AuthContext)

  const { roundData, roomId } = useLoaderData() as {
    roundData: RoundsData
    roomId: string
  }

  const { data /* fireStoreError */ } = useNextPhase(
    roundData?.currentRound
  ) as {
    data: GameState
    fireStoreError: FireStoreError
  }

  // Object that contains user to correct and other users
  const scoringData: ReturnType<typeof getScoringData> = useMemo(() => {
    if (roundData)
      return getScoringData(
        roundData,
        roundData?.currentRound,
        currentUser?.uid
      )
  }, [currentUser?.uid, roundData])

  useEffect(() => {
    if (!data?.scoresSubmitted) return
    if (
      data.scoresSubmitted[`round${roundData?.currentRound}`] ===
      data.totalPlayers
    )
      (async () => await updateGameState('RESULT', roomId))()
  }, [
    data?.scoresSubmitted,
    data?.totalPlayers,
    roomId,
    roundData?.currentRound,
  ])

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

      currentRound: roundData!.currentRound,
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
                  <UserInfo userId={scoringData.userIdToCorrect} />

                  <AnswersList answers={category[1]} />
                  <div className="inline-flex flex-col border-2 border-red-700">
                    {scoringData.otherUsers.map(user => (
                      //[UserId,Answers]
                      <Fragment key={user[0] + category[0]}>
                        <UserInfo userId={user[0]} />
                        <AnswersList answers={user[1][category[0]]} />
                      </Fragment>
                    ))}
                  </div>
                </div>
                <ScoresToggleGroup
                  category={category[0]}
                  scores={scores}
                  setScores={setScores}
                  activeCategories={
                    roundData?.roundsConfig[roundData?.currentRound - 1]
                      .activeCategories
                  }
                />
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
export default Scoring

// eslint-disable-next-line react-refresh/only-export-components
export const loader: LoaderFunction = async ({ params }) => {
  const roundData = await fetchLobbyData(params.roomId!, 'rounds')
  return { roundData, roomId: params.roomId /* , userInfo */ }
}
