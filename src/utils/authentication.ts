import { RegistrationInfoType, UserInfoDb } from '@/lib/types'
import { getAvatarPath } from '@/lib/utils'
import {
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  signInAnonymously,
  updateProfile,
} from 'firebase/auth'
import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../config/config'

export const updateUserProfile = async (
  user: User,
  profileDataToUpdate: {
    photoURL: string
    displayName?: string
  }
) => {
  try {
    await updateProfile(user, profileDataToUpdate)
  } catch (error) {
    throw new Error('There was an error creating a guest user')
  }
}

export const guestSignIn = async function (
  guestName: string,
  avatarIndex: number
) {
  try {
    const res = await signInAnonymously(auth)

    await updateUserProfile(res.user, {
      photoURL: getAvatarPath(avatarIndex),
      displayName: guestName,
    })

    await updateUserInfoDb(res.user.uid, {
      uid: res.user.uid,
      displayName: guestName,
      photoURL: res.user.photoURL,
      isAnonymous: res.user.isAnonymous,
    })

    return auth.currentUser
  } catch (error) {
    throw new Error('There was an error creating a guest user')
  }
}

export const emailSignUp = async (
  { displayName, email, password }: RegistrationInfoType,
  avatarIndex: number
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password)

    await updateUserProfile(res.user, {
      photoURL: getAvatarPath(avatarIndex),
      displayName,
    })

    await updateUserInfoDb(res.user.uid, {
      uid: res.user.uid,
      displayName,
      email,
      photoURL: res.user.photoURL,
      isAnonymous: res.user.isAnonymous,
    })
  } catch (error) {
    throw new Error('There was an error signing up')
  }
}

export const updateUserInfoDb = async (
  userId: string,
  infoToUpdate: UserInfoDb
) => {
  try {
    await setDoc(doc(db, 'users', userId), infoToUpdate, { merge: true })
  } catch (error) {
    throw new Error('There was an error updating user info')
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
