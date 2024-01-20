import { H6 } from '@/components/typography/Headings'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import UserInfo from '@/components/ui/UserInfo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AuthContext } from '@/context/AuthContext'
import useNextPhase from '@/hooks/useNextPhase'
import { RoundsData } from '@/lib/types'
import { getSum } from '@/utils/helpers'
import { SendHorizontal } from 'lucide-react'
import { memo, useContext, useEffect, useMemo, useState } from 'react'
import {
  updateGameState,
  updateScoresData,
} from '../../GameCreation/utils/http'
import AnswersList from './../components/AnswersList'
import ScoresToggleGroup from './../components/CategoryScores'
import { getScoringData } from './../utils/helpers'

type ScoringCardsProps = {
  roundData: RoundsData
}

const ScoringCards = memo(({ roundData }: ScoringCardsProps) => {
  const [scores, setScores] = useState<Record<string, number> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const currentUser = useContext(AuthContext)

  const { data, params /* fireStoreError */ } = useNextPhase()

  // Object that contains user to correct and other users
  const scoringData = useMemo(() => {
    if (
      roundData?.answers[`round${roundData.currentRound}`] &&
      currentUser?.uid
    )
      return getScoringData(
        roundData.answers[`round${roundData.currentRound}`],
        currentUser?.uid
      )
  }, [currentUser, roundData?.answers, roundData?.currentRound])

  const isSubmitted = useMemo(() => {
    if (
      scoringData &&
      data?.scoresSubmitted?.[`round${roundData?.currentRound}`]
    )
      return data?.scoresSubmitted[`round${roundData?.currentRound}`].includes(
        scoringData?.userIdToCorrect
      )
  }, [data?.scoresSubmitted, roundData?.currentRound, scoringData])

  useEffect(() => {
    if (!data?.scoresSubmitted?.[`round${roundData?.currentRound}`]) return
    if (
      data.scoresSubmitted[`round${roundData?.currentRound}`].length ===
      data.totalPlayers
    )
      (async () => await updateGameState('RESULT', params.roomId))()
  }, [
    data?.scoresSubmitted,
    data?.totalPlayers,
    params.roomId,
    roundData?.currentRound,
  ])

  async function handleScoring() {
    const roundScore = getSum(Object.values(scores!))
    const scoreData = {
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
    setIsSubmitting(true)
    await updateScoresData(
      params.roomId!,
      scoringData!.userIdToCorrect,
      scoreData
    )
    setIsSubmitting(false)
  }

  return (
    <article className="grid flex-1 gap-4 px-4 md:grid-cols-2 bg-bg-primary xl:grid-cols-3 lg:px-6 lg:gap-6 xl:px-8 xl:gap-8">
      {scoringData &&
        scoringData?.answersToCorrect.map(category => {
          return (
            <Card className="mt-2 xl:mt-4" key={category.title}>
              <CardHeader>
                <CardTitle className="text-center uppercase">
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-x-2 lg:gap-x-4 ">
                <div className="inline-flex flex-col">
                  <UserInfo
                    userId={scoringData.userIdToCorrect}
                    className="text-xs lg:text-sm"
                    avatarSize="self-start"
                  >
                    <AnswersList answers={category.answers} />
                  </UserInfo>
                </div>
                <Separator className="col-span-2 row-start-2 my-2" />
                <div className="col-span-2 row-start-3 text-sm font-semibold uppercase lg:text-base ">
                  <H6 className="text-center">Answers</H6>
                  <ul className="flex flex-wrap gap-2">
                    {scoringData.otherAnswers?.[category.title] &&
                      scoringData.otherAnswers[category.title].map(
                        (answer, i) => {
                          return <li key={answer + i}>{answer}</li>
                        }
                      )}
                  </ul>
                </div>
                <div className="row-span-1">
                  <ScoresToggleGroup
                    category={category.title}
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
        disabled={isSubmitting || isSubmitted}
        type="button"
        className="mx-auto my-4 col-span-full"
        onClick={handleScoring}
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner /> <span>Submitting</span>
          </>
        ) : (
          <>
            <SendHorizontal />{' '}
            <span>{isSubmitted ? 'Submitted' : 'Submit'}</span>
          </>
        )}
      </Button>
    </article>
  )
})
export default ScoringCards
