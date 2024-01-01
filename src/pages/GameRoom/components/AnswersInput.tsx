import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useLoaderData, useParams } from 'react-router-dom'
import { z } from 'zod'
import { AuthContext } from '../../../context/AuthContext'
import { useOnSnapShot } from '../../../hooks/useOnSnapShot'
import {
  AnswerInputs,
  Answers,
  CreateGameData,
  FireStoreError,
  GameData,
  GameSettings,
} from '../../../lib/types'
import { submitAnswers, updateGameState } from '../../GameCreation/utils/http'
import CategoryAnswers from './CategoryAnswers'

export const AnswerSchema = z.array(z.object({ answer: z.string() }))

export const AnswersSchema = z.record(AnswerSchema)

const AnswersInput = () => {
  const currentUser = useContext(AuthContext)
  const params = useParams()
  const { roundsData } = useLoaderData() as {
    roundsData: CreateGameData
  }

  const { settings } = useLoaderData() as {
    settings: GameSettings
  }

  const activeCategories = useMemo(() => {
    return roundsData?.roundsConfig[roundsData.currentRound - 1]
      .activeCategories
  }, [roundsData.currentRound, roundsData?.roundsConfig])

  const { data: gameData } = useOnSnapShot({
    docRef: 'gameRooms',
    roomId: params.roomId!,
  }) as { data: GameData | undefined; error: FireStoreError }

  const defaultValues = useMemo(() => {
    const defaultValues = {} as AnswerInputs

    activeCategories?.forEach(c => {
      defaultValues[c] = [{ answer: '' }]
    })
    return defaultValues
  }, [activeCategories])

  const form = useForm<z.infer<typeof AnswersSchema>>({
    defaultValues,
    resolver: zodResolver(AnswersSchema),
    mode: 'onChange',
  })

  //Submit Data
  const onSubmit = async (data: AnswerInputs) => {
    console.log(data)
    const formattedData = {} as Answers
    for (const category in data) {
      formattedData[category] = data[category].map(v => v.answer)
    }
    const answers = { [currentUser!.uid]: formattedData }
    if (
      settings.settings['end mode'] === 'Fastest Finger' &&
      gameData?.gameState !== 'END-TIMER'
    )
      await updateGameState('END-TIMER', params.roomId!)

    const donePlayers = await submitAnswers(
      answers,
      params.roomId!,
      roundsData.currentRound
    )

    if (donePlayers === gameData?.totalPlayers) {
      updateGameState('ROUND-ENDED', params.roomId!)
    }
  }

  //Submit Data for players that haven't submitted at round end
  if (
    gameData &&
    gameData.gameState === 'ROUND-ENDED' &&
    (!form.formState.isSubmitting || !form.formState.isSubmitted)
  )
    form.handleSubmit(onSubmit)()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ul>
          {activeCategories?.map(category => (
            <CategoryAnswers key={category} category={category} form={form} />
          ))}
        </ul>
        <Button
          // disabled={form.formState.isSubmitting || form.formState.isSubmitted}
          type="submit"
          // onClick={() => form.clearErrors()}
        >
          Done
        </Button>
      </form>
    </Form>
  )
}
export default AnswersInput
