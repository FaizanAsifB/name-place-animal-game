import { alphabets } from '@/pages/Lobby/utils/utils'

export const AUTOPLAY_SPEED = 50
const MAX_LOOPS = 2

export const MAX_SLIDES = (currentAlphabetIndex: number | null) => {
  if (!currentAlphabetIndex) return null
  return MAX_LOOPS * alphabets.length + currentAlphabetIndex
}

export const FASTEST_FINGER_TIME = 10
