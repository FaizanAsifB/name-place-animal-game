import { alphabets } from '@/pages/Lobby/utils/utils'

export const defaultCategories = [
  { id: 1, label: 'name' },
  { id: 2, label: 'place' },
  { id: 3, label: 'animal' },
  { id: 4, label: 'thing' },
  { id: 5, label: 'occupations' },
  { id: 6, label: 'technology' },
]

export const AUTOPLAY_SPEED = 50
const MAX_LOOPS = 1

export const MAX_SLIDES = (currentAlphabetIndex: number | null) => {
  if (!currentAlphabetIndex) return null
  return MAX_LOOPS * alphabets.length + currentAlphabetIndex
}

export const FASTEST_FINGER_TIME = 10
