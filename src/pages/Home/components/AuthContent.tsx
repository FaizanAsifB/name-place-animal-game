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
import { displayNameAtom } from '@/context/atoms'
import { GameCodeSchema } from '@/lib/types'
import { queryData } from '@/utils/fetchData'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtomValue } from 'jotai'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

const AuthContent = () => {
  const navigate = useNavigate()

  const displayName = useAtomValue(displayNameAtom)

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
    return navigate(`/lobby/${res?.lobbyId}`)
  }

  return (
    <>
      <H2 className="text-center max-w-[20ch]">
        {`Welcome back ${displayName}! `}
      </H2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          // className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="joinCode"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel> Enter code to join</FormLabel>
                <FormControl>
                  <Input placeholder="G2F3X" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Join Game</Button>
        </form>
      </Form>
    </>
  )
}
export default AuthContent
