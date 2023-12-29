import { zodResolver } from '@hookform/resolvers/zod'
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import NumbersIcon from '@mui/icons-material/Numbers'
import SportsScoreIcon from '@mui/icons-material/SportsScore'
import {
  CircularProgress,

  // FormControl,
  // InputLabel,
  // MenuItem,
  // Select,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import { serverTimestamp } from 'firebase/firestore'
import { useContext } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
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
import Setting from '../GameRoom/components/Setting.tsx'
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
      endMode: 'Round Timer',
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

    //!Need to check if this works
    const defaultCategories: DefaultCategories = Object.entries(categoryOptions)
      .filter(item => item[1])
      .map(item => item[0])
    // .reduce((acc: string[], category) => {
    //   if (!category[1]) return acc
    //   if (category[1]) {
    //     acc?.push(category[0])
    //     return acc
    //   }
    // }, [] as string[])

    const settings: RoundSettings = {
      'round time': roundTime,
      rounds,
      'end mode': endMode,
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <ul className="px-6 mb-8 space-y-8">
        <Setting
          icon={<AccessAlarmsIcon fontSize="large" />}
          title={'Time'}
          description={'Maximum time available for each round'}
        >
          <Controller
            name="roundTime"
            control={control}
            render={({ field }) => (
              <Slider
                className="text-red-400"
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
        </Setting>
        <Setting
          icon={<NumbersIcon fontSize="large" />}
          title={'Total Rounds'}
          description={'Choose number of rounds to play'}
        >
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
        </Setting>

        {/* list of categories to display */}
        <Setting
          icon={<LibraryBooksIcon fontSize="large" />}
          title={'Categories'}
          description={'Choose four starter categories'}
        >
          <CategoriesList control={control} />
        </Setting>
        {/*    <Setting
          icon={<SportsScoreIcon fontSize="large" />}
          title={'Round End Mode'}
          description={
            'In fastest finger timer is set to 15 seconds when the first player submits'
          }
        >
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
        </Setting> */}

        {/* End mode */}

        <Setting
          icon={<SportsScoreIcon fontSize="large" />}
          title={'Round End Mode'}
          description={
            'In fastest finger timer is set to 15 seconds when the first player submits'
          }
        >
          <Controller
            name="endMode"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                // value={alignment}
                {...field}
                exclusive
                // onChange={handleAlignment}
                aria-label="round end mode"
              >
                <ToggleButton value="Round Timer" aria-label="round timer mode">
                  Round Timer
                </ToggleButton>
                <ToggleButton
                  value="Fastest Finger"
                  aria-label="fastest finger mode"
                >
                  Fastest Finger
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Setting>
        <Setting
          icon={<LibraryAddIcon fontSize="large" />}
          title={'Custom Categories'}
          description={'Submit two custom categories'}
        >
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
        </Setting>
      </ul>
      <Button
        className="mx-auto"
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
