import { z } from 'zod'
export const defaultCategoriesSchema = z.record(z.boolean())
export type DefaultCategoriesList = z.infer<typeof defaultCategoriesSchema>

export const settingsInputSchema = z
  .object({
    roundTime: z.number(),
    rounds: z.number(),
    defaultCategories: z.array(z.string()).refine(value => value.length === 4, {
      message: 'You have to select at least four categories.',
    }),
    endMode: z.enum(['Fastest Finger', 'Round Timer']),
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
