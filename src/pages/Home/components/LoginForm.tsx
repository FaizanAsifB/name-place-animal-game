import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/button.tsx'
import FormInput from '../../../components/ui/FormInput'
import { auth } from '../../../config/config'
import { LoginSchema, loginSchema } from '../../../lib/types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input.tsx'

type LoginFormProps = {
  onClose: () => void
}

// const {
//   register,
//   handleSubmit,
//   setError,
//   formState: { errors, isSubmitting },
// }

const LoginForm = ({ onClose }: LoginFormProps) => {
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
      onClose()
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
    <>
      <h2 className="mb-4">Enter your email and password</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ul className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormInput
              register={{ ...register('email') }}
              label="Email"
              name="email"
              type="email"
              error={errors.email?.message}
              placeholder="Enter your email"
            /> */}
            <FormInput
              register={{ ...register('password') }}
              label="Password"
              name="password"
              type="password"
              error={errors.password?.message}
              placeholder="Password"
            />
            <menu className="flex gap-4">
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Sign In
              </Button>
            </menu>
          </ul>
        </form>
      </Form>
    </>
  )
}
export default LoginForm
