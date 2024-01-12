import { Categories } from '@/lib/types'
import { Timestamp } from 'firebase/firestore'
import { atom } from 'jotai'

export const avatarAtom = atom(0)
export const displayNameAtom = atom<string | null | undefined>('')

export const categoriesAtom = atom({} as Categories)
export const addedCategoriesAtom = atom(
  [] as
    | {
        addedBy: string
        title: string
        date: Timestamp
      }[]
    | undefined
)

export const currentAlphabetAtom = atom('')
