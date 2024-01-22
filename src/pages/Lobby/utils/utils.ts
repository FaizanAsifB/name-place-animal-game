import { DEFAULT_CATEGORIES } from '@/config/appConfig'
import { DocumentData, Timestamp } from 'firebase/firestore'
import { DefaultCategories, PlayerData } from '../../../lib/types'

type AddedCategories = {
  addedBy: string | undefined
  category1: {
    title: string
    addedAt: Timestamp
  }
  category2: {
    title: string
    addedAt: Timestamp
  }
}

export const inLobby = (data: DocumentData | undefined): number => {
  return data?.slots.reduce((acc: number, item: PlayerData) => {
    if (!item.uid) return acc
    if (item.uid) return acc + 1
  }, 0)
}

export const calcReadyPlayers = (data: DocumentData | undefined): number => {
  return data?.slots.reduce((acc: number, item: PlayerData) => {
    if (!item.isReady) return acc
    if (item.isReady) return acc + 1
  }, 0)
}

export const getAllCategories = (data: DocumentData | undefined) => {
  if (!data) return
  const categories: Array<{ addedBy: string; title: string; date: Timestamp }> =
    []
  Object.entries<AddedCategories>(data.custom).map(user => {
    if (user[1].category1.title)
      categories.push({
        addedBy: user[0],
        title: user[1].category1.title,
        date: user[1].category1.addedAt,
      })
    if (user[1].category2.title)
      categories.push({
        addedBy: user[0],
        title: user[1].category2.title,
        date: user[1].category2.addedAt,
      })
  })
  categories.sort((a, b) => a.date.toMillis() - b.date.toMillis())
  return categories
}

export const getCategoryCount = (data: DocumentData | undefined) => {
  let count = 0
  if (data?.category1.title) count += 1
  if (data?.category2?.title) count += 1
  return count
}

export const categoriesArr = (
  categoriesData: DocumentData | undefined
): string[] | undefined => {
  if (!categoriesData) return
  const data = Object.entries<AddedCategories>(categoriesData.custom).flatMap(
    user => {
      const arr: string[] = []
      if (user[1].category1.title) arr.push(user[1].category1.title)

      if (user[1].category2.title) arr.push(user[1].category2.title)
      return arr
    }
  )
  return data
}

export const alphabets: string[] = new Array(26)
  .fill(1)
  .map((_, i) => String.fromCharCode(65 + i))

function getRandomIndex(max: number): number {
  return Math.floor(Math.random() * max)
}

export const getRoundsConfig = (
  customCategories: string[],
  rounds: number,
  defaultCategories: DefaultCategories
) => {
  let remainingAlphabets = [...alphabets]
  let remainingCategories = [...customCategories]

  let activeCategories = [...defaultCategories]

  const roundsConfig = Array(rounds)
    .fill('')
    .map((_, i) => {
      const activeAlphabet = getRandomItem(remainingAlphabets)
      const categoryToAdd = getRandomItem(remainingCategories)

      remainingAlphabets = remainingAlphabets.filter(
        item => item !== activeAlphabet
      )
      if (i % 2 === 0) {
        if (categoryToAdd) {
          remainingCategories = remainingCategories.filter(
            item => item !== categoryToAdd
          )
          activeCategories = [
            ...activeCategories,
            { id: DEFAULT_CATEGORIES.length + i + 1, title: categoryToAdd },
          ]
        }

        return {
          alphabet: activeAlphabet,
          activeCategories,
        }
      }

      return {
        alphabet: activeAlphabet,
        activeCategories,
      }

      //TODO Check if this is wrong xD
    })
  return roundsConfig
}

const getRandomItem = <T>(data: T[]): T => {
  const i = getRandomIndex(data.length)
  const randomItem = data[i]

  return randomItem
}
