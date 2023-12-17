import { FieldValue, FirestoreErrorCode } from 'firebase/firestore'
import { z } from 'zod'

export const CollectionEnum = z.enum([
  'lobbies',
  'lobbyPlayers',
  'users',
  'categories',
  'gameRooms',
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

export type AddedCategories = Record<
  string,
  { title: string; addedAt: FieldValue }
>

export type GameState =
  | 'LOBBY'
  | 'INIT'
  | 'STARTED'
  | 'END-TIMER'
  | 'ROUND-ENDED'
  | 'SCORING'
  | 'RESULT'
  | 'GAME-COMPLETED'

export type CreateGameData = {
  categories: {
    default: string[]
    custom: string[] | undefined
    active: string[]
  }
  currentRound: number
  rounds: {
    alphabet: string
    categories: string[]
  }[]
}

export type RoundSettings = {
  roundTime: number
  rounds: number
  endMode: 'FASTEST-FINGER' | 'ROUND-TIMER'
}

export type GameSettings = {
  joinCode: string
  hostId: string
  settings: RoundSettings
  roomNr: string
  lobbyId: string
}

export type LobbySettings = {
  slots: PlayerData[]
  settings: RoundSettings
}

export type Answers = Record<string, string[]>
export type AnswersData = {
  [key: string]: Answers
}

export type PlayersData = {
  answers: AnswersData
  gameState: GameState
  hostId: string
  lobbyId: string
  slots: PlayerData[]
  totalPlayers: number
}

export type GameData =
  | ({
      gameState: GameState
      totalPlayers: number
      answers: Record<string, AnswersData[]>
      scores: ScoresData
      scoresSubmitted: Record<string, number>
    } & CreateGameData)
  | undefined

export type ScoresData = {
  [x: string]: ScoreData
}

export type ScoreData = {
  scoresCategory: (Record<string, number> | null)[]
  scoreRounds: number[]
  totalScore: number
}

export type UpdateScoreData = {
  scoresCategory: Record<string, number> | null
  roundScore: number
  scoreRounds: number[]
  currentRound: number | undefined
}
