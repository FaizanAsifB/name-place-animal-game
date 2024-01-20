import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getCurrentRoundConfig } from '@/utils/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { ListChecks } from 'lucide-react'
import { useContext, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useLoaderData, useParams } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
import {
  Answers,
  AnswersSchema,
  CreateGameData,
  GameSettings,
  GameState,
} from '../../../lib/types'
import { submitAnswers, updateGameState } from '../../GameCreation/utils/http'

type AnswerCardsProps = {
  gameData: GameState | undefined
}

const AnswerCards = ({ gameData }: AnswerCardsProps) => {
  const currentUser = useContext(AuthContext)
  const params = useParams()

  const { roundsData, settings } = useLoaderData() as {
    roundsData: CreateGameData
    settings: GameSettings
  }
  //TODO WHY is this type undefined?
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

    if (
      settings.settings.endMode.value === 'Fastest Finger' &&
      gameData?.gameState !== 'END-TIMER'
    )
      await updateGameState('END-TIMER', params.roomId!)

    const donePlayers = await submitAnswers(
      answers,
      params.roomId!,
      roundsData.currentRound!
    )
    if (donePlayers === gameData?.totalPlayers) {
      await updateGameState('SCORING', params.roomId!)
    }
  }

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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 ">
          {activeCategories?.map(category => (
            <Card key={category.id} className="p-2 space-y-3 md:space-y-4">
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
        {/* //TODO should this be sticky? */}

        <Button
          // disabled={form.formState.isSubmitting || form.formState.isSubmitted}
          type="submit"
          className="mx-auto mt-6 md:mt-10 lg:mt-12"
        >
          <ListChecks />
          submit
        </Button>
      </form>
    </Form>
  )
}
export default AnswerCards
