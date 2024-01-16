import { LoaderFunction, useLoaderData } from 'react-router-dom'

import { fetchLobbyData } from '../../utils/fetchData'

import CurrentAlphabet from '@/components/CurrentAlphabet'
import { H6 } from '@/components/typography/Headings'
import GameHeader from '@/components/ui/GameHeader'
import UserInfo from '@/components/ui/UserInfo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AuthContext } from '@/context/AuthContext'
import useNextPhase from '@/hooks/useNextPhase'
import { RoundsData, UpdateScoreData } from '@/lib/types'
import { getCurrentRoundConfig, getSum } from '@/utils/helpers'
import { SendHorizontal } from 'lucide-react'
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

  const { data /* fireStoreError */ } = useNextPhase()

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

  const otherAnswers = useMemo(() => {
    const answers: Record<string, string[]> = {}
    scoringData?.otherUsers.forEach((answer, i) => {
      for (const category in answer[1]) {
        if (i === 0) {
          answers[category] = [...answer[1][category]]
        }
        if (i !== 0) {
          answers[category] = [...answers[category], ...answer[1][category]]
        }
      }
    })

    for (const category in answers) {
      answers[category] = answers[category].filter((value, index, arr) => {
        return arr.indexOf(value) === index && value
      })
    }
    return answers
  }, [scoringData?.otherUsers])

  return (
    <section className="my-8">
      <GameHeader roundsData={roundData}>
        {roundData && (
          <CurrentAlphabet
            className="ml-auto"
            currentAlphabet={getCurrentRoundConfig(roundData).alphabet}
          />
        )}
      </GameHeader>
      <article className="grid gap-4 px-4 md:grid-cols-2 bg-bg-primary xl:grid-cols-3">
        {!scoringData && 'Loading....'}
        {scoringData &&
          // Answers to correct
          Object.entries(scoringData.answersToCorrect).map(category => {
            //[Category,Answer]

            return (
              <Card key={category[0]}>
                <CardHeader>
                  <CardTitle className="text-center uppercase">
                    {category[0]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 lg:gap-4">
                  <div className="inline-flex flex-col">
                    <UserInfo
                      userId={scoringData.userIdToCorrect}
                      className="text-xs"
                      avatarSize="self-start"
                    >
                      <AnswersList answers={category[1]} />
                    </UserInfo>
                  </div>
                  <Separator className="col-span-2 row-start-2 my-2" />
                  <div className="col-span-2 row-start-3 text-sm font-semibold uppercase ">
                    <H6 className="text-center">Answers</H6>
                    <ul className="flex flex-wrap gap-2">
                      {otherAnswers[category[0]].map(answer => {
                        return (
                          <Fragment key={answer}>
                            <li>{answer}</li>
                          </Fragment>
                        )
                      })}
                    </ul>
                  </div>
                  <div className="row-span-1">
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
                </CardContent>
              </Card>
            )
          })}
        <Button
          type="button"
          className="mx-auto my-4 w-fit col-span-full"
          onClick={handleScoring}
        >
          <SendHorizontal /> Submit
        </Button>
      </article>
    </section>
  )
}
export default Scoring

// eslint-disable-next-line react-refresh/only-export-components
export const loader: LoaderFunction = async ({ params }) => {
  const roundData = await fetchLobbyData(params.roomId!, 'rounds')
  return { roundData, roomId: params.roomId /* , userInfo */ }
}
