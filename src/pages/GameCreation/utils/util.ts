import firebase from 'firebase/compat/app'
import { PlayerData } from '../../../lib/types'

export const makePlayerSlots = (
  currentUser: firebase.UserInfo | null,
  length: number
): PlayerData[] => {
  const slots = Array(length)

  slots[0] = {
    slotNr: 0,
    displayName: currentUser?.displayName,
    uid: currentUser!.uid,
    isReady: false,
    isHost: true,
  }

  return slots
    .fill(
      {
        slotNr: 1,
        displayName: '',
        uid: '',
        isReady: false,
        isHost: false,
      },
      1
    )
    .map((item, i) => {
      return { ...item, slotNr: i }
    })
}
