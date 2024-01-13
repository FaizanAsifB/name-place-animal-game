import { H3 } from '@/components/typography/Headings'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
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

type AnswerInputProps = {
  gameData: GameState | undefined
}

const AnswersInput = ({ gameData }: AnswerInputProps) => {
  const currentUser = useContext(AuthContext)
  const params = useParams()

  const { roundsData, settings } = useLoaderData() as {
    roundsData: CreateGameData
    settings: GameSettings
  }

  const activeCategories = useMemo(() => {
    return roundsData?.roundsConfig[roundsData.currentRound - 1]
      .activeCategories
  }, [roundsData.currentRound, roundsData?.roundsConfig])

  const defaultValues = useMemo(() => {
    const defaultValues: Answers = {}

    activeCategories?.forEach(c => {
      defaultValues[c] = ['', '']
    })
    return defaultValues
  }, [activeCategories])

  const form = useForm<Answers>({
    defaultValues,
    resolver: zodResolver(AnswersSchema),
  })

  //Submit Data
  const onSubmit = async (data: Answers) => {
    console.log(data)

    const answers = { [currentUser!.uid]: data }
    console.log(answers)
    if (
      settings.settings.endMode.title === 'Fastest Finger' &&
      gameData?.gameState !== 'END-TIMER'
    )
      await updateGameState('END-TIMER', params.roomId!)

    const donePlayers = await submitAnswers(
      answers,
      params.roomId!,
      roundsData.currentRound
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
        <div className="space-y-8">
          {activeCategories?.map(category => (
            <div
              key={category}
              className="space-y-2 border-2 border-orange-300"
            >
              <Label>
                <H3 className="text-center uppercase">{category}</H3>
              </Label>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`${category}.0`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  key={category}
                  control={form.control}
                  name={`${category}.1`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
        <Button
          // disabled={form.formState.isSubmitting || form.formState.isSubmitted}
          type="submit"
          className="mx-auto mt-8 mb-2"
        >
          Done
        </Button>
      </form>
    </Form>
  )
}
export default AnswersInput
