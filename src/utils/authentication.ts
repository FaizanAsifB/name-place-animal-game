import { RegistrationInfoType, UserInfoUpdate } from '@/lib/types'
import { deleteDataDb } from '@/lib/utils'
import { getAvatarPath } from '@/utils/helpers'
import {
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  signInAnonymously,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebaseConfig'

export const updateUserProfile = async (
  user: User,
  { displayName, email, photoURL, isAnonymous }: UserInfoUpdate
) => {
  try {
    await updateProfile(user, {
      photoURL,
      displayName,
    })
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          displayName,
          email,
          photoURL,
          isAnonymous,
        },
        {
          merge: true,
        }
      )
    } catch (error) {
      throw new Error('There was an error creating user info')
    }
  } catch (error) {
    throw new Error('There was an error creating a guest user')
  }
}

export const updatePhotoUrl = async (
  user: User,
  updatedUserInfo: UserInfoUpdate
) => {
  if (user.photoURL === updatedUserInfo.photoURL) return

  try {
    await updateProfile(user, updatedUserInfo)
    try {
      await setDoc(doc(db, 'users', user.uid), updatedUserInfo, {
        merge: true,
      })
    } catch (error) {
      throw new Error('There was an error updating user info')
    }
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
      displayName: guestName,
      email: res.user.email,
      photoURL: getAvatarPath(avatarIndex),
      isAnonymous: res.user.isAnonymous,
    })
    return res.user.displayName
  } catch (error) {
    throw new Error('There was an error creating a guest user')
  }
}

export const emailSignUp = async (
  { displayName, email, password }: RegistrationInfoType,
  avatarIndex: number
) => {
  const res = await createUserWithEmailAndPassword(auth, email, password)

  updateUserProfile(res.user, {
    displayName,
    email: res.user.email,
    photoURL: getAvatarPath(avatarIndex),
    isAnonymous: res.user.isAnonymous,
  })

  return displayName
}

export const deleteGuestUser = async (currentUser: User) => {
  try {
    await deleteUser(currentUser)
    await deleteDataDb('users', currentUser.uid)
  } catch (error) {
    throw new Error('Error signing out')
  }
}
