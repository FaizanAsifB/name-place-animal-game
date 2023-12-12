import { useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useLoaderData } from 'react-router-dom'
import { AddedCategories, GameData } from '../../../lib/types'
import { Settings } from '../../GameCreation/SettingsForm'

const CategoryInputs = () => {
  const [numInputs, setNumInputs] = useState<Record<string, number> | null>(
    null
  )
  const { gameData, settings } = useLoaderData() as {
    gameData: GameData
    settings: Settings
  }

  // const categories: string[] = useMemo(() => {
  //   const data = categoriesData.default.concat(
  //     Object.entries<AddedCategories>(categoriesData.custom).flatMap(user => {
  //       const arr: string[] = []
  //       if (user[1].category1.title) arr.push(user[1].category1.title)

  //       if (user[1].category2.title) arr.push(user[1].category2.title)
  //       return arr
  //     })
  //   )
  //   return data
  // }, [categoriesData])

  const categories = useMemo(() => {
    return gameData.categories.default.concat(
      gameData.rounds[gameData.currentRound - 1].categories
    )
  }, [gameData])

  console.log(categories)

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

  const onSubmit = async data => {
    console.log(data)
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
                // name={category}
                id={category}
                onKeyDown={e => handleEnter(e)}
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
