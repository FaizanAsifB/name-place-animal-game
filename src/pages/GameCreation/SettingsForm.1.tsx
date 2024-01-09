import { Button } from '@/components/ui/button.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input.tsx'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { zodResolver } from '@hookform/resolvers/zod'
import { serverTimestamp } from 'firebase/firestore'
import { AlarmClock, BellElectric, Gamepad2, Loader2 } from 'lucide-react'
import { useContext } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaFlagCheckered } from 'react-icons/fa6'
import { MdOutlineCategory } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { Categories, PlayerData, RoundSettings } from '../../lib/types.ts'
import Setting from '../GameRoom/components/Setting.tsx'
import CategoriesList from './CategoriesList.tsx'
import { SettingsInput, settingsInputSchema } from './lib/types.tsx'
import { uploadCategories, uploadSettings } from './utils/http.ts'
import { makePlayerSlots } from './utils/util.ts'

//TODO add dynamic import for serverTimeStamp
// const serverTimestamp = () =>
//   import('firebase/firestore').then(module => ({
//     default: module.serverTimestamp,
//   }))
export const SettingsForm = () => {
  const currentUser = useContext(AuthContext)

  const form = useForm<SettingsInput>({
    defaultValues: {
      roundTime: 60,
      rounds: 6,
      defaultCategories: ['name', 'place', 'animal'],
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
    <Form {...form}>
      <form className="" onSubmit={form.handleSubmit(onSubmit)}>
        <ul className="mt-8 space-y-8">
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
                    <FormLabel className="w-20 p-1 text-center border-b-2 border-primary text-primary-foreground">
                      {value} Sec
                    </FormLabel>
                    <FormControl>
                      <Slider
                        // {...field}
                        // className="text-red-400"
                        // aria-label="time per round"
                        defaultValue={[value]}
                        onValueChange={val => {
                          onChange(val[0])
                        }}
                        // onChange={field.onChange}
                        id="round-time"
                        // getAriaValueText={valuetext}
                        // valueLabelDisplay="auto"
                        step={5}
                        // marks
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
            // icon={<NumbersIcon fontSize="large" />}
            title={'Total Rounds'}
            description={'Choose number of rounds to play'}
            icon={<BellElectric />}
          >
            <FormField
              control={form.control}
              name="rounds"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="w-24 p-1 text-center border-b-2 border-primary text-primary-foreground">
                      {value} Rounds
                    </FormLabel>
                    <FormControl>
                      <Slider
                        // className="text-red-400"
                        aria-label="rounds"
                        defaultValue={[value]}
                        onValueChange={val => {
                          onChange(val[0])
                        }}
                        // onChange={field.onChange}
                        id="round-time"
                        // getAriaValueText={valuetext}
                        // valueLabelDisplay="auto"
                        step={1}
                        // marks
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

          <Setting
            // icon={<SportsScoreIcon fontSize="large" />}
            title={'Round End Mode'}
            description={
              'In fastest finger timer is set to 15 seconds when the first player submits'
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
                      >
                        Round Timer
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        aria-label="Select fastest finger"
                        value="Fastest Finger"
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

          {/* End mode */}

          {
            <Setting
              // icon={<LibraryAddIcon fontSize="large" />}
              title={'Custom Categories'}
              description={'Submit two custom categories'}
              icon={<FaFlagCheckered size={24} />}
            >
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="customCategory1"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormControl>
                        <Input placeholder="Add custom category" {...field} />
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
                        <Input placeholder="Add custom category" {...field} />
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
          className="mx-auto"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Gamepad2 className="mr-2" />
          )}
          Create Game
        </Button>
      </form>
    </Form>
  )
}
