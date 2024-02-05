import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  ANSWERS_STORAGE_KEY,
  FASTEST_FINGER_TIME,
  TIME_STORAGE_KEY,
} from '@/config/gameConfig'
import { queryClient } from '@/utils/fetchData'
import {
  getCurrentRoundConfig,
  getTimeInStorage,
  saveToSessionStorage,
} from '@/utils/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ListChecks } from 'lucide-react'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { AuthContext } from '../../../context/AuthContext'
import {
  Answers,
  AnswersSchema,
  EndMode,
  GameScreenRoundsData,
  GameState,
  RoundsData,
} from '../../../lib/types'
import {
  addBonusPoints,
  submitAnswers,
  updateGameState,
} from '../../../utils/http'

type AnswerCardsProps = {
  gameData: GameState
  roundsData: RoundsData | GameScreenRoundsData
  endMode: EndMode
}

const AnswerCards = ({ gameData, roundsData, endMode }: AnswerCardsProps) => {
  const currentUser = useContext(AuthContext)
  const params = useParams()

  const answerStorageKey = ANSWERS_STORAGE_KEY(
    params.roomId!,
    roundsData.currentRound
  )

  const { mutate } = useMutation({
    mutationFn: submitAnswers,
    onSuccess: async data => {
      await queryClient.refetchQueries({
        queryKey: ['roundsData', params.roomId],
        exact: true,
      })

      saveToSessionStorage(answerStorageKey, true)

      if (data === gameData?.totalPlayers)
        await updateGameState('SCORING', params.roomId!)
    },
  })

  const activeCategories = useMemo(() => {
    return getCurrentRoundConfig(roundsData)?.activeCategories
  }, [roundsData])

  const defaultValues = useMemo(() => {
    const defaultValues: Answers = {}

    activeCategories?.forEach(c => {
      defaultValues[c.title] = ['', '']
    })
    return defaultValues
  }, [activeCategories])

  const form = useForm<Answers>({
    defaultValues,
    resolver: zodResolver(AnswersSchema),
  })

  useEffect(() => {
    if (
      Object.keys(form.formState.errors).length > 0 &&
      gameData.gameState !== 'TIME-ENDED'
    )
      toast.error('At least one answer per category is required', {
        position: 'top-center',
      })
  }, [form.formState.errors, gameData.gameState])

  const answeredAllCategories =
    Object.keys(form.formState.dirtyFields).length === activeCategories.length

  const onSubmit = useCallback(
    async (data: Answers) => {
      const answersObj = activeCategories.map(item => ({
        ...item,
        answers: data[item.title].map(answer => answer.trim().toLowerCase()),
      }))

      const answers = { [currentUser!.uid]: answersObj }

      if (endMode === 'Fastest Finger') {
        const timeRemaining = getTimeInStorage(
          TIME_STORAGE_KEY(params.roomId!, roundsData.currentRound)
        )

        if (
          timeRemaining &&
          timeRemaining > FASTEST_FINGER_TIME &&
          gameData.gameState !== 'END-TIMER'
        ) {
          await updateGameState('END-TIMER', params.roomId!)
          await addBonusPoints(
            params.roomId!,
            currentUser!.uid,
            roundsData.currentRound
          )
        }
      }
      mutate({
        answers,
        roomId: params.roomId!,
        currentRound: roundsData.currentRound!,
      })
    },
    [
      activeCategories,
      currentUser,
      endMode,
      gameData.gameState,
      mutate,
      params.roomId,
      roundsData.currentRound,
    ]
  )

  //Submit Data for players that haven't submitted at round end

  useEffect(() => {
    if (
      gameData &&
      gameData.gameState === 'TIME-ENDED' &&
      !form.formState.isSubmitting &&
      !form.formState.isSubmitSuccessful
    ) {
      form.handleSubmit(onSubmit)()
    }
  }, [form, gameData, onSubmit])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid">
        <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:grid-rows-3">
          {activeCategories?.map(category => (
            <Card key={category.id} className="p-1 space-y-3">
              <CardHeader>
                <CardTitle className="text-center uppercase">
                  {category.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex gap-2 md:gap-3 md:flex-col">
                <FormField
                  control={form.control}
                  name={`${category.title}.0`}
                  render={({ field }) => (
                    <FormItem className="flex-1 basis-full">
                      <FormControl>
                        <Input
                          readOnly={
                            form.formState.isSubmitSuccessful ||
                            form.formState.isSubmitting
                          }
                          {...field}
                          className="text-lg text-center md:text-xl lg:text-2xl"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  key={category.id}
                  control={form.control}
                  name={`${category.title}.1`}
                  render={({ field }) => (
                    <FormItem className="flex-1 basis-full">
                      <FormControl>
                        <Input
                          readOnly={
                            form.formState.isSubmitSuccessful ||
                            form.formState.isSubmitting
                          }
                          {...field}
                          className="text-lg text-center md:text-xl lg:text-2xl"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>
        {/* //TODO should this be sticky on smaller screens? */}
        <div className="py-12 lg:pt-10 lg:pb-8">
          <Button
            disabled={
              form.formState.isSubmitting ||
              !answeredAllCategories ||
              form.formState.isSubmitSuccessful
            }
            type="submit"
            className="mx-auto "
          >
            {form.formState.isSubmitting && (
              <>
                <LoadingSpinner /> "Submitting"
              </>
            )}
            {form.formState.isSubmitSuccessful && (
              <>
                <ListChecks /> Submitted
              </>
            )}
            {!form.formState.isSubmitting &&
              !form.formState.isSubmitSuccessful && (
                <>
                  <ListChecks /> Submit
                </>
              )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
export default AnswerCards
