import { DocumentData, doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../backend/firebase'
import { FireStoreError } from '../lib/types'

type SnapShot = {
  docRef: string
  roomId: string
}

export const useOnSnapShot = ({ docRef, roomId }: SnapShot) => {
  const [data, setData] = useState<DocumentData>()
  const [error, setError] = useState<FireStoreError>()

  useEffect(() => {
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

  return { data, error }
}
