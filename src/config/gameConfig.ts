import { alphabets } from '@/pages/Lobby/utils/utils'

export const DEFAULT_CATEGORIES = [
  { id: 1, title: 'name' },
  { id: 2, title: 'place' },
  { id: 3, title: 'animal' },
  { id: 4, title: 'thing' },
  { id: 5, title: 'occupations' },
  { id: 6, title: 'technology' },
]

export const BONUS_POINTS = 10

export const NO_DEFAULT_CATEGORIES = 4
export const CUSTOM_CATEGORY_FIRST_ROUND = 1

export const TIME_PER_NEW_CATEGORY = 10

export const AUTOPLAY_SPEED = 1
const MAX_LOOPS = 1

export const MAX_SLIDES = (currentAlphabetIndex: number | null) => {
  if (currentAlphabetIndex === null) return null
  return MAX_LOOPS * alphabets.length + currentAlphabetIndex
}

export const FASTEST_FINGER_TIME = 10

export const TIME_STORAGE_KEY = (roomId: string, currentRound: number) => {
  return `time${roomId}${currentRound}`
}
export const ANSWERS_STORAGE_KEY = (roomId: string, currentRound: number) => {
  return `answered${roomId}${currentRound}`
}
export const SCORES_STORAGE_KEY = (roomId: string, currentRound: number) => {
  return `scored${roomId}${currentRound}`
}

export const BTN_ICON_SIZE = 36
