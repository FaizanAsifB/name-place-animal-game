import { signInAnonymously, updateProfile } from 'firebase/auth'
import { auth, db } from '../backend/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { GuestSchema } from '../lib/types'

export const guestSignIn = async function (displayName: GuestSchema) {
  try {
    const res = await signInAnonymously(auth)
    try {
      await updateProfile(res.user, {
        displayName,
      })
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        displayName,
        isAnonymous: res.user.isAnonymous,
      })
    } catch (error) {
      throw new Error('There was an error creating a guest user')
    }
  } catch (error) {
    throw new Error('There was an error creating a guest user')
  }
}
