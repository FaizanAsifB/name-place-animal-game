import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { zodResolver } from '@hookform/resolvers/zod'
import { MdAssignmentAdd, MdOutlineCategory } from 'react-icons/md'

import LoadingSpinner from '@/components/ui/LoadingSpinner.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { BTN_ICON_SIZE, DEFAULT_CATEGORIES } from '@/config/gameConfig.ts'
import { AlarmClock, BellElectric, Gamepad2 } from 'lucide-react'
import { useContext } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaFlagCheckered } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import {
  Categories,
  PlayerData,
  RoundSettings,
  SettingsInput,
  settingsInputSchema,
} from '../../lib/types.ts'
import CategoriesList from './CategoriesList.tsx'
import Setting from './components/Setting.tsx'

import { serverTimestamp } from 'firebase/firestore'
import { uploadCategories, uploadSettings } from '../../utils/http.ts'
import { makePlayerSlots } from './utils/util.ts'

const SettingsForm = () => {
  const currentUser = useContext(AuthContext)

  const form = useForm<SettingsInput>({
    defaultValues: {
      roundTime: 60,
      rounds: 6,
      defaultCategories: [...DEFAULT_CATEGORIES.slice(0, 3)],
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
      defaultCategories,
    } = data

    const settings: RoundSettings = {
      roundTime: {
        title: 'Round Time',
        value: roundTime,
      },
      rounds: {
        title: 'Total Rounds',
        value: rounds,
      },
      endMode: {
        title: 'End Mode',
        value: endMode,
      },
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

    const slots: PlayerData[] = makePlayerSlots(currentUser, 10)

    const lobbyId = await uploadSettings({ slots, settings }, currentUser)

    await uploadCategories(categories, lobbyId)

    return navigate(`/game-room/${lobbyId}/lobby`, { replace: true })
  }

  return (
    <Form {...form}>
      <form className="" onSubmit={form.handleSubmit(onSubmit)}>
        <ul className="mt-8 space-y-10">
          <Setting
            title={'Time'}
            description={'Maximum time available for each round'}
            icon={<AlarmClock />}
          >
            <FormField
              control={form.control}
              name="roundTime"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="w-20 p-1 text-center lg:text-base">
                      {value} Sec
                    </FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[value]}
                        onValueChange={val => {
                          onChange(val[0])
                        }}
                        id="round-time"
                        step={5}
                        min={30}
                        max={120}
                      />
                    </FormControl>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </Setting>
          <Setting
            title={'Total Rounds'}
            description={'Total number of rounds to play'}
            icon={<BellElectric />}
          >
            <FormField
              control={form.control}
              name="rounds"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="w-24 p-1 text-center lg:text-base">
                      {value} Rounds
                    </FormLabel>
                    <FormControl>
                      <Slider
                        aria-label="rounds"
                        defaultValue={[value]}
                        onValueChange={val => {
                          onChange(val[0])
                        }}
                        id="round-time"
                        step={1}
                        min={4}
                        max={10}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Setting>

          {/* list of categories to display */}

          <Setting
            icon={<MdOutlineCategory size={24} />}
            title={'Categories'}
            description={'Choose four starter categories'}
          >
            <CategoriesList control={form.control} />
          </Setting>

          {/* End mode */}

          <Setting
            icon={<FaFlagCheckered size={24} />}
            title={'Round End Mode'}
            description={
              'A 10 seconds countdown is initiated when the first player submits'
            }
          >
            <FormField
              control={form.control}
              name="endMode"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      defaultValue={value}
                      value={value}
                      onValueChange={value => {
                        if (value) onChange(value)
                      }}
                    >
                      <ToggleGroupItem
                        aria-label="Select Round Timer"
                        value="Round Timer"
                        className="lg:text-lg"
                      >
                        Round Timer
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        aria-label="Select fastest finger"
                        value="Fastest Finger"
                        className="lg:text-lg"
                      >
                        Fastest Finger
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Setting>

          {
            <Setting
              title={'Custom Categories'}
              description={'Add two categories of your choice'}
              icon={<MdAssignmentAdd size={24} />}
            >
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="customCategory1"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormControl>
                        <Input
                          placeholder="Add custom category"
                          {...field}
                          className="lg:text-lg bg-input-background text-input-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customCategory2"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormControl>
                        <Input
                          placeholder="Add custom category"
                          {...field}
                          className="lg:text-lg bg-input-background text-input-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Setting>
          }
        </ul>
        <Button
          className="mx-auto mt-16 md:mt-20 lg:mt-24"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <LoadingSpinner size={BTN_ICON_SIZE} />
          ) : (
            <Gamepad2 className="size-8 lg:size-10" />
          )}
          Create Game
        </Button>
      </form>
    </Form>
  )
}
export default SettingsForm
