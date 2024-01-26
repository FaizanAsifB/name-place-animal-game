import { Button } from '@/components/ui/button'
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'
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
import { updatePhotoUrl } from '@/utils/authentication'
import { getAvatarPath } from '@/utils/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useAtom } from 'jotai'
import { Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { auth } from '../../../../config/firebaseConfig'
import { LoginSchema, loginSchema } from '../../../../lib/types'

const SignInForm = () => {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (loginDetails: LoginSchema) => {
    const { email, password } = loginDetails

    //TODO add to zod
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === 'auth/invalid-login-credentials'
      )
        form.setError(
          'password',
          {
            type: 'custom',
            message: 'Invalid login credentials, please try again',
          },
          { shouldFocus: true }
        )
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="capitalize">
          Enter your Email and Password
        </DialogTitle>
      </DialogHeader>
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

            <DialogFooter className="items-center pt-4">
              <Button
                type="button"
                variant={'link'}
                size={'sm'}
                disabled={form.formState.isSubmitting}
                onClick={() => {}}
              >
                <span className="text-base ">Forgot Password?</span>
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                variant={'secondary'}
                size={'sm'}
                className=""
              >
                <Mail /> Sign In
              </Button>
            </DialogFooter>
          </ul>
        </form>
      </Form>
    </>
  )
}
export default SignInForm
