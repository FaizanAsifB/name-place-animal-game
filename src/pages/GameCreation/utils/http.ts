import firebase from 'firebase/compat/app'
import {
  collection,
  doc,
  getCountFromServer,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

import { db } from '../../../backend/firebase'
import { Categories, PlayerData } from '../../../lib/types'
import { Settings } from '../SettingsForm'

type LobbySettings = {
  slots: PlayerData[]
  settings: Settings
}

export const uploadCategories = async (
  categories: Categories,
  lobbyId: string
) => {
  try {
    const res = await setDoc(doc(db, 'categories', lobbyId), categories)
    return res
  } catch (error) {
    throw new Error('There was an error creating game')
  }
}

export const uploadSettings = async (
  { slots, settings }: LobbySettings,
  currentUser: firebase.UserInfo | null
) => {
  const snapshot = await getCountFromServer(collection(db, 'lobbies'))
  const roomCount = snapshot.data().count

  const lobbyRef = doc(collection(db, 'lobbies'))

  try {
    await setDoc(lobbyRef, {
      lobbyId: lobbyRef.id,
      roomNr: `room${roomCount + 1}`,
      settings,
      hostId: currentUser!.uid,
      joinCode: lobbyRef.id.slice(-6),
    })

    try {
      await setDoc(doc(db, 'lobbyPlayers', lobbyRef.id), {
        lobbyId: lobbyRef.id,
        gameState: 'lobby',
        hostId: currentUser!.uid,
        slots,
      })
      return lobbyRef.id
    } catch (error) {
      throw new Error('There was an error creating game')
    }
  } catch (error) {
    throw new Error('There was an error creating game')
  }
}

export const updatePlayers = async ({
  roomId,
  updatedData,
}: {
  roomId: string
  updatedData: PlayerData[]
}) => {
  try {
    await updateDoc(doc(db, 'lobbyPlayers', roomId), { slots: updatedData })
  } catch (error) {
    throw Error('Error adding player to lobby')
  }
}

export const createUserCategories = async (roomId: string, userId: string) => {
  const ref = doc(db, 'categories', roomId)
  try {
    await updateDoc(ref, {
      [`custom.${userId}`]: {
        category1: { title: '', addedAt: '' },
        category2: { title: '', addedAt: '' },
      },
    })
  } catch (error) {
    throw Error('Error creating categories')
  }
}

export const submitCategoryInput = async (
  roomId: string,
  userId: string,
  category: { name: string; title: string }
) => {
  const ref = doc(db, 'categories', roomId)
  try {
    await updateDoc(ref, {
      [`custom.${userId}.${category.name}`]: {
        title: category.title,
        addedAt: serverTimestamp(),
      },
    })
  } catch (error) {
    throw Error('Error creating')
  }
}

export const updateGameState = async (gameState: string, roomId: string) => {
  const ref = doc(db, 'lobbyPlayers', roomId)
  try {
    await updateDoc(ref, {
      gameState: gameState,
    })
  } catch (error) {
    throw Error('Error creating')
  }
}
