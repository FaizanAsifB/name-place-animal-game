import { useContext, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLoaderData, useParams } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
import { useOnSnapShot } from '../../../hooks/useOnSnapShot'
import {
  Answers,
  AnswersData,
  GameData,
  GameSettings,
} from '../../../lib/types'
import { submitAnswers, updateGameState } from '../../GameCreation/utils/http'

const CategoryInputs = () => {
  const [numInputs, setNumInputs] = useState<Record<string, number> | null>(
    null
  )
  const currentUser = useContext(AuthContext)
  const params = useParams()

  const { gameData, settings } = useLoaderData() as {
    gameData: GameData
    settings: GameSettings
  }

  const { data: lobbyData } = useOnSnapShot({
    docRef: 'lobbyPlayers',
    roomId: params.roomId!,
  })

  const donePlayers = lobbyData?.answers.length
  if (donePlayers === lobbyData?.totalPlayers) {
    updateGameState('ROUND-ENDED', params.roomId!)
  }
  console.log(donePlayers)

  const categories = useMemo(() => {
    return gameData.categories.default.concat(
      gameData.rounds[gameData.currentRound - 1].categories
    )
  }, [gameData])

  useEffect(() => {
    if (!categories) return
    const inputs: Record<string, number> = {}
    categories.forEach((category: string) => (inputs[category] = 1))
    setNumInputs(inputs)
  }, [categories])

  function addInput(category: string) {
    if (setNumInputs)
      setNumInputs(prev => ({ ...prev, [category]: prev![category] + 1 }))
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    e.nativeEvent.stopImmediatePropagation()
    if (e.code === 'NumpadEnter' || e.code === 'Enter')
      addInput(e.currentTarget.id)
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

  const onSubmit = async (data: Answers) => {
    if (settings.settings.endMode === 'FASTEST-FINGER')
      return updateGameState('END-TIMER', params.roomId!)
    const answers: AnswersData = { [currentUser!.uid]: data }
    await submitAnswers(answers, params.roomId!)
    console.log(answers)

    // const { category1, category2 } = data
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ul>
        {categories.map(category => {
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
