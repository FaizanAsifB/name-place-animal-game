import { PlayerData, RoundsData, ScoresData } from '../lib/types'

export const getSum = (values: number[]): number => {
  return values.reduce((acc, score) => {
    return acc + score
  }, 0)
}

export const getUserInfo = (slots: PlayerData[], uid: string) => {
  const userInfo = slots?.find(slot => slot.uid === uid)
  return { displayName: userInfo?.displayName, photoUrl: userInfo?.photoUrl }
}

// export const getDbUserInfo = uid => {}

export const sortScore = (scoresData: ScoresData | undefined) => {
  if (!scoresData) return
  return Object.entries(scoresData).toSorted(
    (a, b) => b[1].totalScore - a[1].totalScore
  )
}

export const getCurrentRoundConfig = (roundsData: RoundsData) => {
  if (!roundsData) return
  return roundsData?.roundsConfig[roundsData.currentRound]
}
