import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input.tsx'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Mail, XCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { auth } from '../../../config/config'
import { LoginSchema, loginSchema } from '../../../lib/types'

// type LoginFormProps = {
//   onClose: () => void
// }

const LoginForm = () => {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginSchema) => {
    const { email, password } = data

    //!add to zod
    try {
      await signInWithEmailAndPassword(auth, email, password)
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
                  <Input placeholder="Enter your password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant={'secondary'}
                  size={'md'}
                  disabled={form.formState.isSubmitting}
                >
                  <XCircle /> Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                variant={'secondary'}
                size={'md'}
              >
                <Mail /> Sign In
              </Button>
            </DialogFooter>
          </div>
        </ul>
      </form>
    </Form>
  )
}
export default LoginForm
