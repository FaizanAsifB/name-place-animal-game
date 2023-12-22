import { Fragment, useContext, useEffect } from 'react'
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
import { useOnSnapShot } from '../../../hooks/useOnSnapShot'
import {
  Answer,
  AnswerInputs,
  Answers,
  AnswersData,
  FireStoreError,
  GameData,
  GameSettings,
  ScoreData,
} from '../../../lib/types'
import {
  createScoresData,
  submitAnswers,
  updateActiveCategories,
  updateGameState,
} from '../../GameCreation/utils/http'
import CategoryAnswers from './CategoryAnswers'

const FieldArrayTest = () => {
  const currentUser = useContext(AuthContext)
  const params = useParams()
  const { roundsData } = useLoaderData()
  const navigate = useNavigate()

  const { settings } = useLoaderData() as {
    settings: GameSettings
  }

  const activeCategories: string[] =
    roundsData.rounds[roundsData.currentRound - 1].activeCategories

  const { data: gameData } = useOnSnapShot({
    docRef: 'gameRooms',
    roomId: params.roomId!,
  }) as { data: GameData | undefined; error: FireStoreError }

  //!check donePlayers logic
  const donePlayers = () => {
    if (
      !gameData?.answers ||
      !gameData?.answers[`round${gameData?.currentRound}`]
    )
      return 0
    return gameData?.answers[`round${gameData?.currentRound}`].length
  }

  if (donePlayers() === gameData?.totalPlayers) {
    updateGameState('ROUND-ENDED', params.roomId!)
  }

  const defaultValues = {} as AnswerInputs

  activeCategories.forEach(c => {
    defaultValues[c] = [{ answer: '' }]
  })

  const {
    handleSubmit,
    register,
    control,
    setError,
    watch,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<AnswerInputs>({
    defaultValues,
    // name: [
    //   {
    //     answer: '',
    //   },
    // ],
    // place: [
    //   {
    //     answer: '',
    //   },
    // ],
  })

  // const { fields, append } = useFieldArray({
  //   name: 'name',
  //   control,
  // })
  // const { fields: placeFields, append: appendPlace } = useFieldArray({
  //   name: 'place',
  //   control,
  // })

  const onSubmit = async (data: AnswerInputs) => {
    const formattedData = {} as Answer
    for (const category in data) {
      formattedData[category] = data[category].map(v => v.answer)
    }
    const answers = { [currentUser!.uid]: formattedData }
    console.log(answers)
    if (
      settings.settings.endMode === 'FASTEST-FINGER' &&
      gameData?.gameState !== 'END-TIMER'
    )
      await updateGameState('END-TIMER', params.roomId!)

    //!Todo create this while starting the game
    const scoreData: ScoreData = {
      scoresCategory: [],
      scoreRounds: [],
      totalScore: 0,
    }

    // console.log(answers)

    await submitAnswers(answers, params.roomId!, gameData!.currentRound)
    gameData?.currentRound === 1 &&
      (await createScoresData(params.roomId!, currentUser!.uid, scoreData))
    // const { category1, category2 } = data
  }

  if (
    gameData &&
    gameData.gameState === 'ROUND-ENDED' &&
    //!change to !isSubmitted
    (!gameData?.answers ||
      !gameData?.answers[`round${gameData?.currentRound}`].find(
        answer => Object.keys(answer)[0] === currentUser?.uid
      ))
  )
    handleSubmit(onSubmit)()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ul>
        {activeCategories.map(category => (
          // <Fragment>
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
          // </Fragment>
        ))}
      </ul>
      <button type="submit" onClick={() => clearErrors()}>
        Done
      </button>
    </form>
  )
}
export default FieldArrayTest
