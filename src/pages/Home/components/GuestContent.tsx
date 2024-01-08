import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { GuestSchema } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { guestSignIn } from '@/utils/auth'
import { avatarAtom } from '../../../context/atoms'
import { useAtom } from 'jotai'
import { H2 } from '@/components/typography/Headings'

// max-w-[20ch]
const GuestContent = () => {
  const [avatarIndex] = useAtom(avatarAtom)

  const form = useForm<z.infer<typeof GuestSchema>>({
    resolver: zodResolver(GuestSchema),
    defaultValues: {
      guestName: '',
    },
  })

  async function onSubmit(data: z.infer<typeof GuestSchema>) {
    await guestSignIn(data.guestName, avatarIndex)
  }

  return (
    <>
      <H2 className="uppercase w-[22ch] text-center">
        Choose a character and nickname
      </H2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <FormField
            control={form.control}
            name="guestName"
            render={({ field }) => (
              <FormItem className="relative">
                <FormControl>
                  <Input
                    placeholder="RandomNick2002"
                    {...field}
                    className="text-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form>
    </>
  )
}
export default GuestContent
