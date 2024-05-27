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
import { guestSignIn } from '@/utils/authentication'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom, useSetAtom } from 'jotai'
import { LogIn } from 'lucide-react'
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
    const displayName = await guestSignIn(data.guestName, avatarIndex)
    userDisplayName(displayName)
  }

  return (
    <>
      <H3 className="text-center uppercase max-w-[16ch] ">
        Choose a character and nickname
      </H3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="guestName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex text-foreground">
                    <Input
                      placeholder="Your nickname"
                      {...field}
                      className="bg-input-background text-input-foreground"
                    />
                    <Button
                      type="submit"
                      size={'md'}
                      variant={'icon'}
                      className="absolute top-0 right-0 rounded-l-none "
                      disabled={
                        form.formState.isSubmitting ||
                        form.formState.isSubmitSuccessful
                      }
                    >
                      {form.formState.isSubmitting ? (
                        <LoadingSpinner />
                      ) : (
                        <LogIn />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  )
}
export default GuestContent
