import firebase from 'firebase/compat/app'
import { PlayerData } from '../../../lib/types'
import { DEFAULT_SLOT } from '@/config/gameConfig'

export const makePlayerSlots = (
  currentUser: firebase.UserInfo | null,
  length: number
): PlayerData[] => {
  const slots = new Array(length)

  slots[0] = {
    slotNr: 0,
    displayName: currentUser?.displayName,
    uid: currentUser?.uid,
    isReady: false,
    isHost: true,
    photoUrl: currentUser?.photoURL,
  }

  return slots.fill(DEFAULT_SLOT, 1).map((item, i) => {
    return { ...item, slotNr: i }
  })
}
