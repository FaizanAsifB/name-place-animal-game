import {
  User,
  deleteUser,
  signInAnonymously,
  updateProfile,
} from 'firebase/auth'
import { deleteDoc, doc, setDoc } from 'firebase/firestore'
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
      try {
        await setDoc(doc(db, 'users', res.user.uid), {
          uid: res.user.uid,
          displayName: guestName,
          photoURL: res.user.photoURL,
          isAnonymous: res.user.isAnonymous,
        })
        return auth.currentUser
      } catch (error) {
        throw new Error('There was an error creating a guest user')
      }
    } catch (error) {
      throw new Error('There was an error creating a guest user')
    }
  } catch (error) {
    throw new Error('There was an error creating a guest user')
  }
}

export const deleteGuestUser = async (currentUser: User) => {
  if (currentUser?.isAnonymous) {
    try {
      await deleteUser(currentUser!)
      try {
        await deleteDoc(doc(db, 'users', currentUser!.uid))
      } catch (error) {
        throw new Error('Error signing out')
      }
    } catch (error) {
      throw new Error('Error signing out')
    }
  }
  return
}
