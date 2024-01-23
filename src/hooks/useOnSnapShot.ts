import { DocumentData, doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../config/firebaseConfig'
import { FireStoreError } from '../lib/types'

type SnapShot = {
  docRef: string
  roomId: string | undefined
}

export const useOnSnapShot = <T>({ docRef, roomId }: SnapShot) => {
  const [data, setData] = useState<DocumentData>()
  const [error, setError] = useState<FireStoreError>()

  useEffect(() => {
    if (!roomId) return
    const unsub = onSnapshot(
      doc(db, docRef, roomId),

      doc => {
        setData(doc.data({ serverTimestamps: 'estimate' }))
      },
      error => {
        setError({ code: error.code, message: error.message })
      }
    )

    return () => {
      unsub()
    }
  }, [docRef, roomId])

  return { data, error } as { data: T; error: FireStoreError }
}
