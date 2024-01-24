import { QueryClient } from '@tanstack/react-query'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../config/firebaseConfig'
import { CollectionEnum, Q } from '../lib/types'

export const queryClient = new QueryClient()

export const fetchLobbyData = async <T>(
  roomId: string,
  col: CollectionEnum
) => {
  const docRef = doc(db, col, roomId)
  const docSnap = await getDoc(docRef)
  return docSnap.data() as Awaited<Promise<T>>
}

export const fetchPlayers = async (roomId: string | undefined) => {
  if (!roomId) return
  const docRef = doc(db, 'lobbyPlayers', roomId)
  const docSnap = await getDoc(docRef)
  return docSnap.data()
}

export const queryData = async (
  document: string,
  { property, operator, value }: Q
) => {
  const q = query(collection(db, document), where(property, operator, value))
  try {
    const querySnapshot = await getDocs(q)
    // querySnapshot.forEach(doc => {
    //   data = doc.data()
    // })
    return querySnapshot?.docs[0]?.data()
  } catch (error) {
    throw new Error('error fetching data')
  }
}
