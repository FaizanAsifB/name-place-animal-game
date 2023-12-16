import firebase from 'firebase/compat/app'
import {
  arrayUnion,
  collection,
  doc,
  getCountFromServer,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

import { db } from '../../../backend/firebase'
import {
  AnswersData,
  Categories,
  CreateGameData,
  GameState,
  LobbySettings,
  PlayerData,
  ScoreData,
  UpdateScoreData,
} from '../../../lib/types'
import {} from '../SettingsForm'

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
      await setDoc(doc(db, 'gameRooms', lobbyRef.id), {
        gameState: 'LOBBY',
        totalPlayers: 1,
      })
    } catch (error) {
      throw new Error('There was an error creating game')
    }

    try {
      await setDoc(doc(db, 'lobbyPlayers', lobbyRef.id), {
        lobbyId: lobbyRef.id,
        gameState: 'LOBBY',
        totalPlayers: 1,
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
    await updateDoc(doc(db, 'lobbyPlayers', roomId), {
      slots: updatedData,
    })
  } catch (error) {
    throw Error('Error adding player to lobby')
  }
}

export const addPlayerCount = async (roomId: string) => {
  try {
    await updateDoc(doc(db, 'gameRooms', roomId), {
      totalPlayers: increment(1),
    })
  } catch (error) {
    throw Error('Error updating')
  }
  try {
    await updateDoc(doc(db, 'lobbyPlayers', roomId), {
      totalPlayers: increment(1),
    })
  } catch (error) {
    throw Error('Error updating')
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

export const updateGameState = async (gameState: GameState, roomId: string) => {
  const ref = doc(db, 'gameRooms', roomId)
  try {
    await updateDoc(ref, {
      gameState,
    })
  } catch (error) {
    throw Error('Error creating')
  }
  try {
    await updateDoc(doc(db, 'lobbyPlayers', roomId), {
      gameState,
    })
  } catch (error) {
    throw Error('Error creating')
  }
}

export const createGameData = async (lobbyId: string, data: CreateGameData) => {
  try {
    const res = await updateDoc(doc(db, 'gameRooms', lobbyId), data)
    return res
  } catch (error) {
    throw new Error('There was an error creating game')
  }
}

export const submitAnswers = async (
  answers: AnswersData,
  roomId: string,
  currentRound: number
) => {
  const ref = doc(db, 'gameRooms', roomId)
  try {
    await updateDoc(ref, {
      [`answers.round${currentRound}`]: arrayUnion(answers),
    })
  } catch (error) {
    throw Error('Error creating')
  }
}

export const createScoresData = async (
  lobbyId: string,
  uid: string,
  data: ScoreData
) => {
  try {
    const res = await updateDoc(doc(db, 'gameRooms', lobbyId), {
      [`scores.${uid}`]: data,
    })
    return res
  } catch (error) {
    throw new Error('There was an error creating game')
  }
}

export const updateScoresData = async (
  lobbyId: string,
  uid: string,
  data: UpdateScoreData
) => {
  try {
    const res = await updateDoc(doc(db, 'gameRooms', lobbyId), {
      [`scores.${uid}.scoresCategory`]: arrayUnion(data.scoresCategory),
      [`scores.${uid}.scoreRounds`]: arrayUnion(data.roundScore),
      [`scores.${uid}.totalScore`]: increment(data.roundScore),
    })
    try {
      await updateDoc(doc(db, 'gameRooms', lobbyId), {
        scoresSubmitted: increment(1),
      })
    } catch (error) {
      throw new Error('There was an error updating')
    }
    return res
  } catch (error) {
    throw new Error('There was an error creating game')
  }
}
