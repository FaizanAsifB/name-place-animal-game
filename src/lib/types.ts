import {
  FieldValue,
  FirestoreErrorCode,
  WhereFilterOp,
} from 'firebase/firestore'
import { z } from 'zod'
import { getRoundsConfig } from '../pages/Lobby/utils/utils'
import { queryData } from '../utils/fetchData'

export type UserInfo = {
  uid: string
  displayName: string
  isAnonymous: boolean
  photoURL: string
  email?: string | null
}

export type UserInfoUpdate = {
  uid?: string
  displayName?: string
  isAnonymous?: boolean
  photoURL: string
  email?: string | null
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
    .toLowerCase()
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
    .email()
    .trim()
    .min(6, { message: 'Email must contain at least 6 characters' })
    .max(30, { message: 'Email should not exceed 30 characters' }),
  password: z
    .string()
    .min(8, { message: 'Password must contain at least 8 characters' })
    .max(30),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const DisplayNameSchema = z.object({
  displayName: z
    .string()
    .min(3, { message: 'Display Name must contain at least 3 characters' })
    .max(20),
})

export const signUpSchema = loginSchema
  .merge(DisplayNameSchema)
  .extend({
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  })

export type SignUpType = z.infer<typeof signUpSchema>

const RegistrationInfoSchema = loginSchema.merge(DisplayNameSchema)

export type RegistrationInfoType = z.infer<typeof RegistrationInfoSchema>

// export type UserInfo = {
//   uid?: string
//   displayName?: string
//   photoURL: string | null
//   isAnonymous?: boolean
//   email?: string
// }

export type PlayerData = {
  isReady: boolean
  uid: string
  displayName: string | null
  slotNr: number
  isHost: boolean
  photoUrl: string | undefined
}

export const defaultCategoriesSchema = z.record(z.boolean())
export type DefaultCategoriesList = z.infer<typeof defaultCategoriesSchema>

const EndModeSchema = z.union([
  z.literal('Fastest Finger'),
  z.literal('Round Timer'),
])

export const settingsInputSchema = z
  .object({
    roundTime: z.number(),
    rounds: z.number(),
    defaultCategories: z
      .array(
        z.object({
          id: z.number(),
          title: z.string(),
        })
      )
      .refine(value => value.length === 4, {
        message: 'You have to select at least four categories.',
      }),
    endMode: EndModeSchema,
    customCategory1: z
      .string()
      .min(1, { message: 'You must submit two categories' }),
    customCategory2: z
      .string()
      .min(1, { message: 'You must submit two categories' }),
  })
  .refine(
    data =>
      (!data.customCategory1 && !data.customCategory2) ||
      data.customCategory1 !== data.customCategory2,
    {
      message: 'Please enter a different category',
      path: ['customCategory2'],
    }
  )

export type SettingsInput = z.infer<typeof settingsInputSchema>

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

export type DefaultCategories = {
  id: number
  title: string
}[]
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
  | 'CANCELLED'

export type CreateGameData = {
  currentRound: number
  roundsConfig: RoundsConfig
  scores: ScoresData
}

export type RoundsConfig = ReturnType<typeof getRoundsConfig>

export type EndMode = z.infer<typeof EndModeSchema>

export type RoundSettings = {
  roundTime: {
    title: string
    value: number
  }
  rounds: {
    title: string
    value: number
  }
  endMode: {
    title: string
    value: EndMode
  }
}

export type GameSettings = {
  joinCode: string
  hostId: string
  settings: RoundSettings
  roomNr: string
  lobbyId: string
}

export type LobbyPlayers = {
  slots: PlayerData[]
  hostId: string
}

export const AnswerSchema = z.string().array()

export const AnswersSchema = z.record(z.string(), AnswerSchema)

export type Answers = z.infer<typeof AnswersSchema>

export const SubmittedAnswerSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    answers: z.string().array().length(2),
  })
  .array()

export type UserAnswers = {
  [key: string]: z.infer<typeof SubmittedAnswerSchema>
}

export type AnswersData = {
  [key: string]: UserAnswers[]
}

export type PlayersData = {
  hostId: string
  slots: PlayerData[]
}

export type GameState = {
  currentRound: number
  gameState: GameStates
  scoresSubmitted: Record<string, string[]>
  totalPlayers: number
  toStarted: Record<string, string[]> | undefined
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
  currentRound: number
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

export type GameScreenRoundsData = {
  scores: ScoresData
} & CreateGameData
