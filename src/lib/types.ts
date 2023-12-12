import { FieldValue, FirestoreErrorCode } from 'firebase/firestore'
import { z } from 'zod'

export const CollectionEnum = z.enum([
  'lobbies',
  'lobbyPlayers',
  'users',
  'categories',
])
export type CollectionEnum = z.infer<typeof CollectionEnum>

export const guestSchema = z.string().trim().min(3).max(20)

export type GuestSchema = z.infer<typeof guestSchema>

export const loginSchema = z.object({
  email: z.string().trim().min(6).max(30),
  password: z.string().min(8).max(30),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const signUpSchema = loginSchema
  .extend({
    displayName: z.string().min(3).max(20),
    email: z.string().trim().min(6).max(30),
    password: z.string().min(8).max(30),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  })

export type SignUpSchema = z.infer<typeof signUpSchema>

export const gameCodeSchema = z.string().trim().length(6)
export type GameCodeSchema = z.infer<typeof gameCodeSchema>

export type PlayerData = {
  isReady: boolean
  uid: string
  displayName: string
  slotNr: number
  isHost: boolean
}

export const customCategoriesSchema = z
  .object({
    category1: z.string().max(20),
    category2: z.string().max(20),
  })
  .refine(data => data.category1 !== data.category2, {
    message: 'Please enter a different category',
    path: ['category2'],
  })

export type CustomCategoriesSchema = z.infer<typeof customCategoriesSchema>

export type FireStoreError =
  | {
      code: FirestoreErrorCode
      message: string
    }
  | undefined

export type DefaultCategories = string[] | undefined

export type Categories = {
  default: DefaultCategories
  custom: {
    [userId: string]: AddedCategories
  }
}

export type AddedCategories = {
  category1: {
    title: string
    addedAt: FieldValue
  }
  category2: {
    title: string
    addedAt: FieldValue
  }
}
