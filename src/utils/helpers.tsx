import { TIME_STORAGE_KEY } from '@/config/gameConfig'
import {
  CreateGameData,
  GameScreenRoundsData,
  PlayerData,
  RoundsData,
  ScoresData,
} from '../lib/types'
import { getTimeInStorage } from '@/pages/GameScreen/components/util/utils'

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

export const getTimeRemaining = (roomId: string, currentRound: number) => {
  const storageKey = TIME_STORAGE_KEY(roomId, currentRound)
  return getTimeInStorage(storageKey)
}
