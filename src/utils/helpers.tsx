import { PlayerData } from '../lib/types'

export const getSum = (values: number[]): number => {
  return values.reduce((acc, score) => {
    return acc + score
  }, 0)
}

export const getUserInfo = (slots: PlayerData[], uid: string) => {
  return slots.find(slot => slot.uid === uid)
}
