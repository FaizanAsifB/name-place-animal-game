import {
  FieldValue,
  FirestoreErrorCode,
  WhereFilterOp,
} from 'firebase/firestore'
import { z } from 'zod'
import { getRoundsData } from '../pages/Lobby/utils/utils'

export const CollectionEnum = z.enum([
  'lobbies',
  'lobbyPlayers',
  'users',
  'categories',
  'gameRooms',
  'rounds',
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
  photoUrl: string
}

export const customCategoriesSchema = z
  .object({
    category1: z.string().max(20).min(1, { message: 'Category 1 is required' }),
    category2: z.string().max(20).min(1, { message: 'Category 2 is required' }),
  })
  .refine(
    data =>
      data.category1 !== data.category2 || data.category2 !== data.category1,
    {
      message: 'Please enter a different category',
      path: ['category2'],
    }
  )

// export type CustomCategoriesType = z.infer<typeof customCategoriesSchema>
export type CustomCategoriesType = Record<string, string>

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
  currentRound: number
  rounds: RoundsData
}

export type RoundsData = ReturnType<typeof getRoundsData>
// categories: {
//   default: string[]
//   custom: string[] | undefined
//   active: string[]
// }
// currentRound: number
// rounds: {
//   alphabet: string
//   categories: string[]
// }[]

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

export type AnswerInputs = Record<string, { answer: string }[]>

export type Answer = Record<string, string[]>
// export type Answers = Record<string, Answer>
export type AnswersData = {
  [key: string]: Answer
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

export type Q = {
  property: string
  operator: WhereFilterOp
  value: string
}
