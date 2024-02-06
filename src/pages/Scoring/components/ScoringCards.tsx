import { H6 } from '@/components/typography/Headings'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import UserInfo from '@/components/ui/UserInfo'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { BTN_ICON_SIZE } from '@/config/gameConfig'
import { AuthContext } from '@/context/AuthContext'
import useNextPhase from '@/hooks/useNextPhase'
import { RoundsData } from '@/lib/types'
import { queryClient } from '@/utils/fetchData'
import { getSum } from '@/utils/helpers'
import { useMutation } from '@tanstack/react-query'
import { SendHorizontal } from 'lucide-react'
import { memo, useContext, useMemo, useRef, useState } from 'react'
import { twJoin } from 'tailwind-merge'
import { updateScoresData } from '../../../utils/http'
import useSessionStorage from '../hooks/useSessionStorage'
import AnswersList from './../components/AnswersList'
import ScoresToggleGroup from './../components/CategoryScores'
import { getScoringData } from './../utils/helpers'

type ScoringCardsProps = {
  roundsData: RoundsData
}
export type ScoringData = {
  userIdToCorrect: string
  answersToCorrect: {
    id: number
    title: string
    answers: string[]
  }[]
  otherAnswers: Record<string, string[]>
}

const ScoringCards = memo(({ roundsData }: ScoringCardsProps) => {
  const [scores, setScores] = useState<Record<string, number> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const currentUser = useContext(AuthContext)
  const isValid = useRef(true)

  const { data: gameData, params /* fireStoreError */ } = useNextPhase()

  const { mutate } = useMutation({
    mutationFn: updateScoresData,
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['roundsData', params.roomId, 'results'],
        exact: true,
      })
    },
  })

  const currentRoundName = useMemo(
    () => `round${roundsData?.currentRound}`,
    [roundsData?.currentRound]
  )

  // Object that contains user to correct and other users
  const scoringData = useMemo(() => {
    if (!currentUser) return
    return getScoringData(roundsData.answers[currentRoundName], currentUser.uid)
  }, [currentUser, roundsData, currentRoundName])

  const submittedUsers = gameData?.scoresSubmitted?.[currentRoundName]

  const isCurrentUserSubmitted = useMemo(() => {
    if (scoringData && submittedUsers)
      return submittedUsers.includes(currentUser!.uid)
  }, [currentUser, scoringData, submittedUsers])

  useSessionStorage(
    submittedUsers,
    roundsData.currentRound,
    gameData?.totalPlayers
  )

  function hasAnswerNoScore() {
    const noScore: string[] = []

    scoringData?.answersToCorrect.forEach(({ title, answers }) => {
      if (scores?.[title] === 0 && (answers[0] || answers[1]))
        noScore.push(title.toUpperCase())
    })
    return noScore
  }
  function handleScoring() {
    if (!scores) return
    if (hasAnswerNoScore().length > 0) {
      isValid.current = false
      setIsOpen(true)
    }

    if (!isValid.current) return
    const roundScore = getSum(Object.values(scores))
    const scoreData = {
      scoresCategory: scores,
      roundScore,
      scoreRounds:
        roundsData?.currentRound === 1
          ? [roundScore]
          : [
              ...roundsData!.scores[scoringData!.userIdToCorrect].scoreRounds,
              roundScore,
            ],

      currentRound: roundsData!.currentRound,
    }
    setIsSubmitting(true)
    mutate({
      lobbyId: params.roomId!,
      currentUserId: currentUser!.uid,
      idToCorrect: scoringData!.userIdToCorrect,
      data: scoreData,
    })
    setIsSubmitting(false)
  }

  return (
    <article className="grid flex-1 gap-4 px-4 md:grid-cols-2 bg-bg-primary xl:grid-cols-3 lg:px-6 lg:gap-6 xl:px-8 xl:gap-8 ">
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Is the score correct?</AlertDialogTitle>
            <AlertDialogDescription>
              {`The following categorie${
                hasAnswerNoScore().length > 0 ? 's' : ''
              } have been answered but received zero points: ${hasAnswerNoScore().join(
                ', '
              )}`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {}}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {scoringData &&
        scoringData?.answersToCorrect.map(category => {
          const otherAnswers = scoringData?.otherAnswers[category.title]
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
                    className="text-sm lg:text-base text-accent"
                    avatarSize="self-start"
                  >
                    <AnswersList
                      answers={category.answers}
                      otherAnswers={otherAnswers}
                    />
                  </UserInfo>
                </div>
                <Separator className="col-span-2 row-start-2 my-2" />
                <div className="col-span-2 row-start-3 text-sm font-semibold uppercase lg:text-base ">
                  <H6 className="text-center">Answers</H6>
                  <ul className="flex flex-wrap gap-2">
                    {otherAnswers
                      ?.filter(
                        (answer, i) => otherAnswers.indexOf(answer) === i
                      )
                      .map((answer, i) => {
                        return (
                          <li
                            key={answer + i}
                            className={twJoin(
                              'text-base lg:text-xl',
                              category.answers.indexOf(answer) === 0 &&
                                'bg-yellow-500',
                              category.answers.indexOf(answer) === 1 &&
                                'bg-lime-500'
                            )}
                          >
                            {answer}
                          </li>
                        )
                      })}
                  </ul>
                </div>
                <div className="row-span-1">
                  <ScoresToggleGroup
                    category={category.title}
                    scoringData={scoringData}
                    scores={scores}
                    setScores={setScores}
                    activeCategories={
                      roundsData?.roundsConfig[roundsData?.currentRound - 1]
                        .activeCategories
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      <Button
        disabled={isSubmitting || isCurrentUserSubmitted}
        type="button"
        className="mx-auto my-4 col-span-full"
        onClick={handleScoring}
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner size={BTN_ICON_SIZE} /> <span>Submitting</span>
          </>
        ) : (
          <>
            <SendHorizontal />{' '}
            <span>{isCurrentUserSubmitted ? 'Submitted' : 'Submit'}</span>
          </>
        )}
      </Button>
    </article>
  )
})
export default ScoringCards
