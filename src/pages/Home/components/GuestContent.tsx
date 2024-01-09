import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { H3 } from '@/components/typography/Headings'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { GuestSchema } from '@/lib/types'
import { guestSignIn } from '@/utils/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { avatarAtom } from '../../../context/atoms'

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
    console.log(data)
    await guestSignIn(data.guestName, avatarIndex)
  }

  return (
    <>
      <H3 className="uppercase w-[22ch] text-center">
        Choose a character and nickname
      </H3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <FormField
            control={form.control}
            name="guestName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="RandomNick2002" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size={'md'} variant={'secondary'}>
            Login
          </Button>
        </form>
      </Form>
    </>
  )
}
export default GuestContent
