import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input.tsx'
import { avatarAtom } from '@/context/atoms'
import { getAvatarPath } from '@/lib/utils'
import { updatePhotoUrl } from '@/utils/authentication'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useAtom } from 'jotai'
import { Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { auth } from '../../../config/config'
import { LoginSchema, loginSchema } from '../../../lib/types'

const SignInForm = () => {
  const [avatarIndex] = useAtom(avatarAtom)
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (loginDetails: LoginSchema) => {
    const { email, password } = loginDetails

    //TODO add to zod
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)

      await updatePhotoUrl(res.user, { photoURL: getAvatarPath(avatarIndex) })

      // onClose()
    } catch (error) {
      form.setError(
        'password',
        {
          type: 'custom',
          message: 'Invalid login credentials, please try again',
        },
        { shouldFocus: true }
      )
      // throw new Error('There was an error signing in')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ul className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="mt-8">
            {/* <Button
              type="button"
              variant={'link'}
              size={'md'}
              disabled={form.formState.isSubmitting}
            >
              <ClipboardList /> Sign Up
            </Button> */}
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              variant={'secondary'}
              size={'md'}
              className="mt-4 ml-auto"
            >
              <Mail /> Sign In
            </Button>
          </DialogFooter>
        </ul>
      </form>
    </Form>
  )
}
export default SignInForm
