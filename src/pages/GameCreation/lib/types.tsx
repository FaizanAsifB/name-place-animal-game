import { z } from 'zod'
export const defaultCategoriesSchema = z.record(z.boolean())
export type DefaultCategoriesList = z.infer<typeof defaultCategoriesSchema>

export const settingsInputSchema = z
  .object({
    roundTime: z.number(),
    rounds: z.number(),
    name: z.boolean(),
    place: z.boolean(),
    animal: z.boolean(),
    thing: z.boolean(),
    occupations: z.boolean(),
    technology: z.boolean(),
    endMode: z.enum(['FASTEST-FINGER', 'ROUND-TIMER']),
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
