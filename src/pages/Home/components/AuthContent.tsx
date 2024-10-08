import { H2 } from '@/components/typography/Headings'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AuthContext } from '@/context/AuthContext'
import { avatarAtom, displayNameAtom } from '@/context/atoms'
import { GameCodeSchema } from '@/lib/types'
import { updatePhotoUrl } from '@/utils/authentication'
import { queryData } from '@/utils/fetchData'
import { getAvatarPath } from '@/utils/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom, useAtomValue } from 'jotai'
import { DoorOpen } from 'lucide-react'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

const AuthContent = () => {
  const navigate = useNavigate()

  const displayName = useAtomValue(displayNameAtom)
  const [avatarIndex] = useAtom(avatarAtom)

  const currentUser = useContext(AuthContext)

  const form = useForm<z.infer<typeof GameCodeSchema>>({
    resolver: zodResolver(GameCodeSchema),
    defaultValues: {
      joinCode: '',
    },
  })

  async function onSubmit(data: z.infer<typeof GameCodeSchema>) {
    const res = await queryData('lobbies', {
      property: 'joinCode',
      operator: '==',
      value: data.joinCode,
    })
    await updatePhotoUrl(currentUser!, { photoURL: getAvatarPath(avatarIndex) })

    return navigate(`game-room/${res?.lobbyId}/lobby`)
  }

  return (
    <>
      <H2 className="tracking-wide text-center uppercase md:text-left lg:pt-1">
        Welcome!
        <br></br>
        {displayName!.toUpperCase()}
      </H2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="joinCode"
            render={({ field }) => (
              <FormItem className="relative text-center md:text-left">
                <FormLabel className="text-lg">Enter code to join</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="G2F3XA"
                      maxLength={6}
                      {...field}
                      className="bg-input-background text-input-foreground"
                    />
                    <Button
                      variant={'icon'}
                      size={'md'}
                      className="absolute top-0 right-0 rounded-l-none "
                      type="submit"
                    >
                      <DoorOpen />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  )
}
export default AuthContent
