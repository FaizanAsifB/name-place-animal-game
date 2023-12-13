import { QueryClient } from '@tanstack/react-query'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../backend/firebase'
import { CollectionEnum } from '../lib/types'

export const queryClient = new QueryClient()

export const fetchLobbyData = async (roomId: string, col: CollectionEnum) => {
  const docRef = doc(db, col, roomId)
  const docSnap = await getDoc(docRef)
  return docSnap.data()
}

// export const fetchPlayers = async (roomId: string) => {
//   const docRef = doc(db, 'lobbyPlayers', roomId)
//   const docSnap = await getDoc(docRef)
//   return docSnap.data()
// }
