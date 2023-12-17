import { useContext, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
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
  createScoresData,
  submitAnswers,
  updateGameState,
} from '../../GameCreation/utils/http'

const CategoryInputs = () => {
  const [numInputs, setNumInputs] = useState<Record<string, number> | null>(
    null
  )

  const currentUser = useContext(AuthContext)
  const params = useParams()
  const navigate = useNavigate()

  const { settings } = useLoaderData() as {
    settings: GameSettings
  }

  const { data: gameData } = useOnSnapShot({
    docRef: 'gameRooms',
    roomId: params.roomId!,
  }) as { data: GameData | undefined; error: FireStoreError }

  const roundCategories = useMemo(() => {
    return gameData?.categories.default.concat(
      gameData?.rounds[gameData.currentRound - 1].categories
    )
  }, [gameData])

  function calcInputs() {
    if (!roundCategories) return
    const inputs: Record<string, number> = {}
    roundCategories.forEach((category: string) => (inputs[category] = 1))
    setNumInputs(inputs)
  }

  if (!numInputs) calcInputs()

  //! need to optimize useEffect

  useEffect(() => {
    gameData?.gameState === 'ROUND-ENDED' && navigate('scoring')
  }, [roundCategories, gameData?.gameState, navigate, numInputs])

  console.log(numInputs)
  function addInput(category: string) {
    if (numInputs)
      setNumInputs(prev => ({ ...prev, [category]: prev![category] + 1 }))
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    e.nativeEvent.stopImmediatePropagation()
    if (e.code === 'NumpadEnter' || e.code === 'Enter') {
      e.preventDefault()
      addInput(e.currentTarget.id)
    }
  }

  const {
    handleSubmit,
    register,
    // setValue,
    // setFocus,
    // getFieldState,
    // clearErrors,
    // setError,
    // getValues,
    // formState: { errors, isSubmitting, isDirty },
  } = useForm()

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
  const onSubmit = async (data: Answers) => {
    const answers: AnswersData = { [currentUser!.uid]: data }
    if (settings.settings.endMode === 'FASTEST-FINGER')
      await updateGameState('END-TIMER', params.roomId!)

    const scoreData: ScoreData = {
      scoresCategory: [],
      scoreRounds: [],
      totalScore: 0,
    }

    await submitAnswers(answers, params.roomId!, gameData!.currentRound)
    await createScoresData(params.roomId!, currentUser!.uid, scoreData)

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
        {roundCategories?.map(category => {
          const inputs = numInputs ? numInputs[category] : 1
          const inputsArr = []
          for (let i = 0; i < inputs; i++) {
            inputsArr.push(
              <input
                {...register(`${category}.${i}`)}
                key={`category-${i}`}
                type="text"
                id={category}
                onKeyDown={handleEnter}
              />
            )
          }
          return (
            <li key={category}>
              <label htmlFor={category}>{category}</label>
              {inputsArr.map(input => input)}

              <button type="button" onClick={() => addInput(category)}>
                +
              </button>
            </li>
          )
        })}
      </ul>
      <button type="submit">Done</button>
    </form>
  )
}
export default CategoryInputs
