import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getCurrentRoundConfig } from '@/utils/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ListChecks } from 'lucide-react'
import { useContext, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
import {
  Answers,
  AnswersSchema,
  EndMode,
  GameScreenRoundsData,
  GameState,
  RoundsData,
} from '../../../lib/types'
import { submitAnswers, updateGameState } from '../../../utils/http'
import { queryClient } from '@/utils/fetchData'

type AnswerCardsProps = {
  gameData: GameState
  roundsData: RoundsData | GameScreenRoundsData
  endMode: EndMode
}

const AnswerCards = ({ gameData, roundsData, endMode }: AnswerCardsProps) => {
  const currentUser = useContext(AuthContext)
  const params = useParams()

  const { mutate } = useMutation({
    mutationFn: submitAnswers,
    onSuccess: async data => {
      await queryClient.refetchQueries({
        queryKey: ['roundsData', params.roomId],
        exact: true,
      })
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

  //Submit Data
  const onSubmit = async (data: Answers) => {
    const answersObj = activeCategories.map(item => ({
      ...item,
      answers: data[item.title],
    }))

    const answers = { [currentUser!.uid]: answersObj }

    if (endMode === 'Fastest Finger' && gameData?.gameState !== 'END-TIMER')
      await updateGameState('END-TIMER', params.roomId!)

    mutate({
      answers,
      roomId: params.roomId!,
      currentRound: roundsData.currentRound!,
    })

    return
  }

  console.log(form.formState.defaultValues)

  //Submit Data for players that haven't submitted at round end
  if (
    gameData &&
    gameData.gameState === 'TIME-ENDED' &&
    !form.formState.isSubmitting &&
    !form.formState.isSubmitted
  )
    form.handleSubmit(onSubmit)()

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
            disabled={form.formState.isSubmitting || form.formState.isSubmitted}
            type="submit"
            className="mx-auto "
          >
            <ListChecks />
            submit
          </Button>
        </div>
      </form>
    </Form>
  )
}
export default AnswerCards
