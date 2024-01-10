import {
  FieldValue,
  FirestoreErrorCode,
  WhereFilterOp,
} from 'firebase/firestore'
import { z } from 'zod'
import { getRoundsConfig } from '../pages/Lobby/utils/utils'
import { queryData } from '../utils/fetchData'

export type User = {
  uid: string
  displayName: string
  isAnonymous: boolean
  photoUrl: string
}

export const CollectionEnum = z.enum([
  'lobbies',
  'lobbyPlayers',
  'users',
  'categories',
  'gameRooms',
  'rounds',
])
export type CollectionEnum = z.infer<typeof CollectionEnum>

export const GuestSchema = z.object({
  guestName: z
    .string()
    .trim()
    .min(3, { message: 'Nickname must be at least 3 characters' })
    .max(20)
    .refine(
      async val => {
        const res = await queryData('users', {
          property: 'displayName',
          operator: '==',
          value: val,
        })
        return !res
      },
      { message: 'This nickname is already in use' }
    ),
})

export type GuestName = z.infer<typeof GuestSchema>

export const GameCodeSchema = z.object({
  joinCode: z
    .string()
    .trim()
    .length(6)
    .refine(
      async val => {
        const res = await queryData('lobbies', {
          property: 'joinCode',
          operator: '==',
          value: val,
        })
        return res
      },
      { message: 'Enter a valid gameCode' }
    ),
})

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(6, { message: 'Email must contain at least 6 characters' })
    .max(30, { message: 'Email should not exceed 30 characters' }),
  password: z
    .string()
    .min(8, { message: 'Password must contain at least 8 characters' })
    .max(30),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const signUpSchema = loginSchema
  .extend({
    displayName: z
      .string()
      .min(3, { message: 'Display Name must contain at least 3 characters' })
      .max(20),
    // email: z.string().trim().min(6).max(30),
    // password: z.string().min(8).max(30),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  })

export type SignUpSchema = z.infer<typeof signUpSchema>

export type PlayerData = {
  isReady: boolean
  uid: string
  displayName: string | null
  slotNr: number
  isHost: boolean
  photoUrl: string | undefined
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

export type DefaultCategories = string[]
export type CustomCategories = {
  [userId: string]: AddedCategories
}

export type Categories = {
  default: DefaultCategories
  custom: CustomCategories
}

export type AddedCategories = Record<
  string,
  { title: string; addedAt: FieldValue }
>

export type GameStates =
  | 'LOBBY'
  | 'INIT'
  | 'STARTED'
  | 'END-TIMER'
  | 'TIME-ENDED'
  | 'ROUND-ENDED'
  | 'SCORING'
  | 'RESULT'
  | 'GAME-COMPLETED'

export type CreateGameData = {
  currentRound: number
  roundsConfig: RoundsConfig
}

export type RoundsConfig = ReturnType<typeof getRoundsConfig>

export type RoundSettings = {
  'round time': number
  rounds: number
  'end mode': 'Fastest Finger' | 'Round Timer'
}

export const GameSettingsData = z.object({
  joinCode: z.string(),
  hostId: z.string(),
  settings: z.object({
    'round time': z.number(),
    round: z.number(),
    'end mode': z.enum(['Fastest Finger', 'Round Timer']),
  }),
  roomNr: z.string(),
  lobbyId: z.string(),
})

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

export type Answers = Record<string, string[]>

export type UserAnswers = {
  [key: string]: Answers
}

export type AnswersData = {
  [key: string]: UserAnswers[]
}

export type PlayersData = {
  // answers: AnswersData
  // gameState: GameStates
  hostId: string
  // lobbyId: string
  slots: PlayerData[]
  // totalPlayers: number
}

export type GameState = {
  currentRound: number
  gameState: GameStates
  scoresSubmitted: Record<string, number>
  totalPlayers: number
}

export type GameData =
  | ({
      gameState: GameStates
      totalPlayers: number
      answers: Record<string, AnswersData[]>
      scores: ScoresData
      scoresSubmitted: Record<string, number>
    } & CreateGameData)
  | undefined

export type ScoresData = Record<string, ScoreData>

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

export type RoundsData = {
  answers: AnswersData
  scores: ScoresData
} & CreateGameData
