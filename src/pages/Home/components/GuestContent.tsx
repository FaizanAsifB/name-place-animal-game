import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { H3 } from '@/components/typography/Headings'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
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
import { useAtom, useSetAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { avatarAtom, displayNameAtom } from '../../../context/atoms'

const GuestContent = () => {
  const [avatarIndex] = useAtom(avatarAtom)
  const userDisplayName = useSetAtom(displayNameAtom)

  const form = useForm<z.infer<typeof GuestSchema>>({
    resolver: zodResolver(GuestSchema),
    defaultValues: {
      guestName: '',
    },
  })

  async function onSubmit(data: z.infer<typeof GuestSchema>) {
    const userProfile = await guestSignIn(data.guestName, avatarIndex)
    userDisplayName(userProfile?.displayName)
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
          <Button
            type="submit"
            size={'md'}
            variant={'secondary'}
            disabled={
              form.formState.isSubmitting || form.formState.isSubmitSuccessful
            }
          >
            {form.formState.isSubmitting && <LoadingSpinner />}Login
          </Button>
        </form>
      </Form>
    </>
  )
}
export default GuestContent
