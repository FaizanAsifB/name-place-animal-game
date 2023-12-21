import { Fragment, useContext, useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
import { useOnSnapShot } from '../../../hooks/useOnSnapShot'
import {
  Answers,
  AnswersData,
  FireStoreError,
  GameData,
  GameSettings,
  ScoreData,
} from '../../../lib/types'
import {
  updateActiveCategories,
  updateGameState,
} from '../../GameCreation/utils/http'

type AnswerInputs = Record<string, { answer: string }[]>

const FieldArrayTest = () => {
  const currentUser = useContext(AuthContext)
  const params = useParams()
  const { roundsData } = useLoaderData()
  const navigate = useNavigate()

  const { settings } = useLoaderData() as {
    settings: GameSettings
  }

  const activeCategories =
    roundsData.rounds[roundsData.currentRound - 1].activeCategories

  console.log(activeCategories)

  const { data: gameData } = useOnSnapShot({
    docRef: 'gameRooms',
    roomId: params.roomId!,
  }) as { data: GameData | undefined; error: FireStoreError }

  function addInput() {
    append({ answer: '' })
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    e.nativeEvent.stopImmediatePropagation()
    if (e.code === 'NumpadEnter' || e.code === 'Enter') {
      e.preventDefault()
      append({ answer: '' })
    }
  }

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

  const { handleSubmit, register, control } = useForm<AnswerInputs>({
    defaultValues: {
      name: [
        {
          answer: '',
        },
      ],
      place: [
        {
          answer: '',
        },
      ],
    },
  })

  const { fields, append } = useFieldArray({
    name: 'name',
    control,
  })
  const { fields: placeFields, append: appendPlace } = useFieldArray({
    name: 'place',
    control,
  })

  const onSubmit = async (data: Answers) => {
    const answers: AnswersData = { [currentUser!.uid]: data }
    if (settings.settings.endMode === 'FASTEST-FINGER')
      await updateGameState('END-TIMER', params.roomId!)

    const scoreData: ScoreData = {
      scoresCategory: [],
      scoreRounds: [],
      totalScore: 0,
    }

    console.log(answers)

    // await submitAnswers(answers, params.roomId!, gameData!.currentRound)
    // gameData?.currentRound === 1 &&
    //   (await createScoresData(params.roomId!, currentUser!.uid, scoreData))
    // const { category1, category2 } = data
  }

  if (
    gameData &&
    gameData.gameState === 'ROUND-ENDED' &&
    (!gameData?.answers ||
      !gameData?.answers[`round${gameData?.currentRound}`].find(
        answer => Object.keys(answer)[0] === currentUser?.uid
      ))
  )
    handleSubmit(onSubmit)()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ul>
        <li>
          <label htmlFor="field">Name</label>
          {fields.map((field, index) => {
            return (
              <input
                key={field.id}
                type="text"
                {...register(`name.${index}.answer` as const)}
                onKeyDown={handleEnter}
              />
            )
          })}
          <button type="button" onClick={addInput}>
            +
          </button>
        </li>
        <li>
          <label htmlFor="placeFields">Place</label>
          {placeFields.map((placeField, index) => {
            return (
              <input
                key={placeField.id}
                type="text"
                {...register(`place.${index}.answer` as const)}
                onKeyDown={handleEnter}
              />
            )
          })}
          <button type="button" onClick={() => appendPlace({ answer: '' })}>
            +
          </button>
        </li>
      </ul>
      <button type="submit">Done</button>
    </form>
  )
}
export default FieldArrayTest
