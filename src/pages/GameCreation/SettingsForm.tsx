import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
} from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms'
import { serverTimestamp } from 'firebase/firestore'
import { useContext } from 'react'
import { GrGamepad } from 'react-icons/gr'
import { useNavigate } from 'react-router-dom'
import ErrorText from '../../components/forms/ErrorText.tsx'
import Button from '../../components/ui/Button'
import { AuthContext } from '../../context/AuthContext'
import {
  Categories,
  DefaultCategories,
  PlayerData,
  RoundSettings,
} from '../../lib/types.ts'
import CategoriesList from './CategoriesList.tsx'
import { SettingsInput, settingsInputSchema } from './lib/types.tsx'
import { uploadCategories, uploadSettings } from './utils/http.ts'
import { makePlayerSlots } from './utils/util.ts'

const SettingsForm = () => {
  const currentUser = useContext(AuthContext)

  const {
    control,
    handleSubmit,
    register,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SettingsInput>({
    defaultValues: {
      roundTime: 60,
      rounds: 6,
      name: true,
      place: true,
      animal: true,
      thing: false,
      occupations: false,
      technology: false,
      endMode: 'ROUND-TIMER',
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

    const settings: RoundSettings = {
      roundTime,
      rounds,
      endMode,
    }

    const categories: Categories = {
      default: defaultCategories,
      custom: {
        [currentUser!.uid]: {
          category1: { title: customCategory1, addedAt: serverTimestamp() },
          category2: { title: customCategory2, addedAt: serverTimestamp() },
        },
      },
    }

    const slots: PlayerData[] = makePlayerSlots(currentUser, 8)

    const lobbyId = await uploadSettings({ slots, settings }, currentUser)

    await uploadCategories(categories, lobbyId)

    return navigate(`/lobby/${lobbyId}`)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-24 place-items-center"
    >
      <ul className="mx-4 space-y-8 settings">
        <li>
          <div className="flex items-center gap-2">
            <AccessAlarmsIcon fontSize="large" />
            <div>
              <h5>Time</h5>
              <p className="text-lg">Maximum time available for each round</p>
            </div>
          </div>
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
                defaultValue={5}
                // getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={4}
                max={10}
              />
            )}
          />
        </li>
        {/* list of categories to display */}
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
                  <MenuItem value="ROUND-TIMER">Round Timer</MenuItem>
                  <MenuItem value="FASTEST-FINGER">Fastest Finger</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </li>
        <li>
          <h5>Custom Categories</h5>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <ErrorText align={'left'}>
                {errors.customCategory1?.message}
              </ErrorText>
              <input
                {...register('customCategory1')}
                type="text"
                name="customCategory1"
                placeholder="Add custom category"
                onBlur={() => clearErrors()}
              />
            </div>
            <div className="relative">
              <ErrorText align={'left'}>
                {errors.customCategory2?.message}
              </ErrorText>

              <input
                {...register('customCategory2')}
                type="text"
                name="customCategory2"
                placeholder="Add custom category"
                onBlur={() => clearErrors()}
              />
            </div>
          </div>
        </li>
      </ul>
      <Button
        type="submit"
        disabled={isSubmitting}
        icon={isSubmitting ? <CircularProgress /> : <GrGamepad />}
      >
        Create Game
      </Button>
    </form>
  )
}
export default SettingsForm
