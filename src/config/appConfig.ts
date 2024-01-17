import { alphabets } from '@/pages/Lobby/utils/utils'

export const DEFAULT_CATEGORIES = [
  { id: 1, title: 'name' },
  { id: 2, title: 'place' },
  { id: 3, title: 'animal' },
  { id: 4, title: 'thing' },
  { id: 5, title: 'occupations' },
  { id: 6, title: 'technology' },
]

export const AUTOPLAY_SPEED = 50
const MAX_LOOPS = 1

export const MAX_SLIDES = (currentAlphabetIndex: number | null) => {
  if (!currentAlphabetIndex) return null
  return MAX_LOOPS * alphabets.length + currentAlphabetIndex
}

export const FASTEST_FINGER_TIME = 10
