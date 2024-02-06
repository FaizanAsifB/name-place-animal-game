import firebase from 'firebase/compat/app'
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

import { BONUS_POINTS } from '@/config/gameConfig'
import { db } from '../config/firebaseConfig'
import {
  Categories,
  CreateGameData,
  GameStates,
  PlayerData,
  RoundSettings,
  RoundsData,
  UpdateScoreData,
  UserAnswers,
} from '../lib/types'
import { fetchLobbyData } from './fetchData'

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
  { slots, settings }: { slots: PlayerData[]; settings: RoundSettings },
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
      })
    } catch (error) {
      throw new Error('There was an error creating game')
    }

    try {
      await setDoc(doc(db, 'lobbyPlayers', lobbyRef.id), {
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
  updatedData: PlayerData[] | undefined
}) => {
  if (!updatedData) return
  try {
    await updateDoc(doc(db, 'lobbyPlayers', roomId), {
      slots: updatedData,
    })
  } catch (error) {
    throw Error('Error adding player to lobby')
  }
}

export const addPlayerCount = async (roomId: string, totalPlayers: number) => {
  try {
    await updateDoc(doc(db, 'gameRooms', roomId), {
      totalPlayers: totalPlayers,
    })
  } catch (error) {
    throw Error('Error updating')
  }
  try {
    await updateDoc(doc(db, 'lobbyPlayers', roomId), {
      totalPlayers: totalPlayers,
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

export const updateGameState = async (
  gameState: GameStates,
  roomId: string | undefined
) => {
  if (!roomId) return
  const ref = doc(db, 'gameRooms', roomId)
  try {
    await updateDoc(ref, {
      gameState,
    })
  } catch (error) {
    throw Error('Error creating')
  }
}

export const submitSlideEnd = async (
  roomId: string | undefined,
  userId: string | undefined,
  currentRound: number
) => {
  if (!roomId || !userId) return
  const ref = doc(db, 'gameRooms', roomId)
  try {
    return await updateDoc(ref, {
      [`toStarted.round${currentRound}`]: arrayUnion(userId),
    })
  } catch (error) {
    throw Error('Error creating')
  }
}

export const createRoundsData = async ({
  lobbyId,
  data,
}: {
  lobbyId: string
  data: CreateGameData
}) => {
  try {
    await setDoc(doc(db, 'rounds', lobbyId), data)
  } catch (error) {
    throw new Error('There was an error creating game')
  }
}

export const submitAnswers = async ({
  answers,
  roomId,
  currentRound,
}: {
  answers: UserAnswers
  roomId: string
  currentRound: number
}) => {
  const ref = doc(db, 'rounds', roomId)
  try {
    await updateDoc(ref, {
      [`answers.round${currentRound}`]: arrayUnion(answers),
    })

    try {
      const res = await fetchLobbyData<RoundsData>(roomId, 'rounds')
      const answers = res?.answers[`round${currentRound}`].length
      return answers
    } catch (error) {
      throw Error('Error creating')
    }
  } catch (error) {
    throw Error('Error creating')
  }
}

export const updateScoresData = async ({
  lobbyId,
  idToCorrect,
  currentUserId,
  data,
}: {
  lobbyId: string
  idToCorrect: string
  currentUserId: string
  data: UpdateScoreData
}) => {
  try {
    await updateDoc(doc(db, 'rounds', lobbyId), {
      [`scores.${idToCorrect}.scoresCategory`]: arrayUnion(data.scoresCategory),
      [`scores.${idToCorrect}.scoreRounds`]: data.scoreRounds,
      [`scores.${idToCorrect}.totalScore`]: increment(data.roundScore),
    })
    try {
      await updateDoc(doc(db, 'gameRooms', lobbyId), {
        [`scoresSubmitted.round${data.currentRound}`]:
          arrayUnion(currentUserId),
      })
    } catch (error) {
      throw new Error('There was an error updating')
    }
  } catch (error) {
    throw new Error('There was an error creating game')
  }
}

export const updateCurrentRound = async (roomId: string) => {
  try {
    await updateDoc(doc(db, 'rounds', roomId), {
      currentRound: increment(1),
    })
  } catch (error) {
    throw new Error('Error updating')
  }
}

export const updateActiveCategories = async (
  roomId: string,
  categories: string[]
) => {
  try {
    await updateDoc(doc(db, 'gameRooms', roomId), {
      'categories.active': arrayUnion(...categories),
    })
  } catch (error) {
    throw Error('Error updating')
  }
}

export const addBonusPoints = async (
  roomId: string,
  userId: string,
  currentRound: number
) => {
  try {
    await updateDoc(doc(db, 'rounds', roomId), {
      [`scores.${userId}.totalScore`]: increment(BONUS_POINTS),
    })
    try {
      await updateDoc(doc(db, 'gameRooms', roomId), {
        [`bonusPoints.round${currentRound}`]: { userId },
      })
    } catch (error) {
      throw Error('Error updating')
    }
  } catch (error) {
    throw Error('Error updating')
  }
}

export const deleteLobby = async (roomId: string) => {
  try {
    await deleteDoc(doc(db, 'categories', roomId))
    await deleteDoc(doc(db, 'gameRooms', roomId))
    await deleteDoc(doc(db, 'lobbies', roomId))
    await deleteDoc(doc(db, 'lobbyPlayers', roomId))
  } catch (error) {
    throw Error('An error occurred')
  }
}
