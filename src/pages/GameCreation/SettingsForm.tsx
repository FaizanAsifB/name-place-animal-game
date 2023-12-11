import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
} from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { Timestamp, serverTimestamp } from 'firebase/firestore'
import { useContext } from 'react'
import { GrGamepad } from 'react-icons/gr'
import { useNavigate } from 'react-router-dom'
import ErrorText from '../../components/forms/ErrorText.tsx'
import Button from '../../components/ui/Button'
import { AuthContext } from '../../context/AuthContext'
import {
  Categories,
  CustomCategories,
  DefaultCategories,
  PlayerData,
} from '../../lib/types.ts'
import CategoriesList from './CategoriesForm.tsx'
import { SettingsInput, settingsInputSchema } from './lib/types.tsx'
import { uploadAddedCategories, uploadSettings } from './utils/http.ts'
import { makePlayerSlots } from './utils/util.ts'

export type Settings = {
  roundTime: number
  rounds: number
  endMode: string
}

const SettingsForm = () => {
  const currentUser = useContext(AuthContext)
  let userId: string
  if (currentUser) userId = currentUser?.uid

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SettingsInput>({
    defaultValues: {
      roundTime: 60,
      rounds: 6,
      name: true,
      place: true,
      animal: true,
      thing: true,
      occupations: false,
      technology: false,
      endMode: '',
      customCategory1: '',
      customCategory2: '',
    },
    resolver: zodResolver(settingsInputSchema),
  })
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<SettingsInput> = async data => {
    const {
      roundTime,
      rounds,
      endMode,
      customCategory1,
      customCategory2,
      ...categoryOptions
    } = data

    const defaultCategories: DefaultCategories = Object.entries(
      categoryOptions
    ).reduce<string[] | undefined>((acc: string[] | undefined, category) => {
      if (!category[1]) return acc
      if (category[1]) {
        acc?.push(category[0])
        return acc
      }
    }, [] as string[])

    const settings: Settings = {
      roundTime,
      rounds,
      endMode,
    }

    const categories: Categories = {
      default: defaultCategories,
      custom: {
        [userId]: {
          category1: { title: customCategory1, addedAt: serverTimestamp() },
          category2: { title: customCategory2, addedAt: serverTimestamp() },
        },
      },
    }

    const slots: PlayerData[] = makePlayerSlots(currentUser, 8)

    const lobbyId = await uploadSettings({ slots, settings }, currentUser)

    await uploadAddedCategories(categories, lobbyId)

    return navigate(`/lobby/${lobbyId}`)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-24 place-items-center"
    >
      <ul className="mx-4 space-y-8 settings">
        <li>
          <h5>Time per rounded</h5>
          <Controller
            name="roundTime"
            control={control}
            render={({ field }) => (
              <Slider
                {...field}
                aria-label="time per round"
                defaultValue={60}
                // onChange={onChange}
                id="round-time"
                // getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={5}
                marks
                min={30}
                max={120}
              />
            )}
          />
        </li>
        <li>
          <h5>Total Rounds</h5>
          <Controller
            name="rounds"
            control={control}
            render={({ field }) => (
              <Slider
                {...field}
                aria-label="rounds"
                defaultValue={6}
                // getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={4}
                max={20}
              />
            )}
          />
        </li>
        <CategoriesList control={control} />
        <li>
          <h5>Round End Mode</h5>
          <FormControl fullWidth>
            <InputLabel id="end-mode-label">End Mode</InputLabel>
            <Controller
              name="endMode"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="end-mode-label"
                  id="end-mode"
                  variant="filled"
                  label="round timer"
                >
                  <MenuItem value="round timer">Round Timer</MenuItem>
                  <MenuItem value="fastest finger">Fastest Finger</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </li>
        <li>
          <h5>Custom Categories</h5>
          <div className="grid grid-cols-2 gap-2">
            <ErrorText>{errors.customCategory1?.message}</ErrorText>
            <input
              {...register('customCategory1')}
              type="text"
              name="customCategory1"
              placeholder="Add custom category"
            />
            <ErrorText>{errors.customCategory2?.message}</ErrorText>
            <input
              {...register('customCategory2')}
              type="text"
              name="customCategory2"
              placeholder="Add custom category"
            />
          </div>
        </li>
      </ul>
      <Button type="submit" icon={<GrGamepad />}>
        {isSubmitting ? 'submitting.....' : 'Create Game'}
      </Button>
    </form>
  )
}
export default SettingsForm
