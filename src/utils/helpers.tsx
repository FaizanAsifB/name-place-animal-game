import {
  BONUS_POINTS,
  CUSTOM_CATEGORY_FIRST_ROUND,
  NO_DEFAULT_CATEGORIES,
  TIME_PER_NEW_CATEGORY,
} from '@/config/gameConfig'
import data from '../data/data.json'
import {
  CreateGameData,
  GameScreenRoundsData,
  PlayerData,
  RoundsData,
  ScoresData,
} from '../lib/types'

export const getSum = (values: number[]): number => {
  return values.reduce((acc, score) => {
    return acc + score
  }, 0)
}

export const getUserInfo = (slots: PlayerData[], uid: string) => {
  const userInfo = slots?.find(slot => slot.uid === uid)
  return { displayName: userInfo?.displayName, photoUrl: userInfo?.photoUrl }
}

export const sortScore = (scoresData: ScoresData | undefined) => {
  if (!scoresData) return
  return Object.entries(scoresData).toSorted(
    (a, b) => b[1].totalScore - a[1].totalScore
  )
}

export const getCurrentRoundConfig = (
  roundsData: RoundsData | GameScreenRoundsData | CreateGameData
) => {
  return roundsData?.roundsConfig[roundsData.currentRound - 1]
}

export const timeInSeconds = (time: number) => {
  return (time - Date.now()) / 1000
}

export function getAvatarPath(avatarIndex: number) {
  return data.avatarImages[avatarIndex].path
}

export function saveToSessionStorage<T>(key: string, value: T) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    throw Error('Session Storage not available')
  }
}

export function getFromSessionStorage<T>(key: string): T | undefined {
  try {
    const storedData = window.sessionStorage.getItem(key)
    if (!storedData) return
    return JSON.parse(storedData)
  } catch (err) {
    throw Error('Session Storage not available')
  }
}

export const getTimeInStorage = (storageKey: string) => {
  const time = getFromSessionStorage<number>(storageKey)
  if (time) return (time - Date.now()) / 1000
}

export const getBonusPoints = (
  bonusPoints: Record<string, Record<string, string>>,
  userId: string
) => {
  let count = 0
  if (!bonusPoints) return count
  Object.values(bonusPoints).forEach(round => {
    if (round.userId === userId) count++
  })
  return count * BONUS_POINTS
}

export const calcRoundTime = (
  activeCategories: number | undefined,
  initialRoundTime: number | undefined
) => {
  if (!activeCategories || !initialRoundTime) return
  return (
    initialRoundTime +
    TIME_PER_NEW_CATEGORY *
      (activeCategories - NO_DEFAULT_CATEGORIES - CUSTOM_CATEGORY_FIRST_ROUND)
  )
}
