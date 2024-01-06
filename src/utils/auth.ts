import { signInAnonymously, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../config/config'
import data from '../data/data.json'

export const guestSignIn = async function (
  guestName: string,
  avatarIndex: number
) {
  try {
    const res = await signInAnonymously(auth)
    try {
      await updateProfile(res.user, {
        displayName: guestName,
        photoURL: data.avatarImages[avatarIndex].path,
      })
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        displayName: guestName,
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
