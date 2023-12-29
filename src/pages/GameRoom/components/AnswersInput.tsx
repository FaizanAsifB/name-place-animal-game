import { useContext, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useLoaderData, useParams } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
import { useOnSnapShot } from '../../../hooks/useOnSnapShot'
import {
  AnswerInputs,
  Answers,
  // AnswersData,
  // Answers,
  // AnswersData,
  CreateGameData,
  FireStoreError,
  GameData,
  GameSettings,
} from '../../../lib/types'
import { submitAnswers, updateGameState } from '../../GameCreation/utils/http'
import CategoryAnswers from './CategoryAnswers'

const AnswersInput = () => {
  const currentUser = useContext(AuthContext)
  const params = useParams()
  const { roundsData } = useLoaderData() as {
    roundsData: CreateGameData
  }
  // const navigate = useNavigate()

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

  const {
    handleSubmit,
    register,
    control,
    setError,
    watch,
    getValues,
    clearErrors,
    formState: { errors, isSubmitted, isSubmitting },
  } = useForm<AnswerInputs>({
    defaultValues,
  })

  //Submit Data
  const onSubmit = async (data: AnswerInputs) => {
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
    (!isSubmitting || !isSubmitted)
  )
    handleSubmit(onSubmit)()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ul>
        {activeCategories?.map(category => (
          <CategoryAnswers
            key={category}
            category={category}
            register={register}
            control={control}
            watch={watch}
            getValues={getValues}
            setError={setError}
            clearErrors={clearErrors}
            errors={errors}
          />
        ))}
      </ul>
      <button
        // disabled={isSubmitting || isSubmitted}
        type="submit"
        onClick={() => clearErrors()}
      >
        Done
      </button>
    </form>
  )
}
export default AnswersInput
