import { z } from 'zod'

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
    endMode: z.string(),
    customCategory1: z.string(),
    customCategory2: z.string(),
  })
  .refine(data => data.customCategory1 !== data.customCategory2, {
    message: 'Please enter a different category',
    path: ['customCategory2'],
  })

export type SettingsInput = z.infer<typeof settingsInputSchema>
