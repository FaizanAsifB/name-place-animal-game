import { db } from '@/config/firebaseConfig'
import { clsx, type ClassValue } from 'clsx'
import { deleteDoc, doc } from 'firebase/firestore'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function deleteDataDb(collection: string, docToDelete: string) {
  try {
    await deleteDoc(doc(db, collection, docToDelete))
  } catch (error) {
    throw new Error('There was an error handling your request')
  }
}
