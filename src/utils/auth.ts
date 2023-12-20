import { signInAnonymously, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../config/config'
import { GuestSchema } from '../lib/types'
import { displayImages } from './utils'

export const guestSignIn = async function (
  displayName: GuestSchema,
  avatarIndex: number
) {
  try {
    const res = await signInAnonymously(auth)
    try {
      await updateProfile(res.user, {
        displayName,
        photoURL: displayImages[avatarIndex].path,
      })
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        displayName,
        photoURL: res.user.photoURL,
        isAnonymous: res.user.isAnonymous,
      })
    } catch (error) {
      throw new Error('There was an error creating a guest user')
    }
  } catch (error) {
    throw new Error('There was an error creating a guest user')
  }
}
