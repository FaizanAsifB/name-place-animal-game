import { signInWithEmailAndPassword } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { auth } from '../../../backend/firebase'
import Button from '../../../components/ui/Button'
import FormInput from '../../../components/ui/FormInput'
import { LoginSchema, loginSchema } from '../../../lib/types'
import { zodResolver } from '@hookform/resolvers/zod'

type LoginFormProps = {
  onClose: () => void
}

const LoginForm = ({ onClose }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginSchema) => {
    const { email, password } = data

    try {
      await signInWithEmailAndPassword(auth, email, password)
      onClose()
    } catch (error) {
      throw new Error('There was an error signing in')
    }
  }

  return (
    <>
      <h2 className="mb-4">Enter your email and password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul className="space-y-4">
          <FormInput
            register={{ ...register('email') }}
            label="Email"
            name="email"
            type="email"
            error={errors.email?.message}
            placeholder="Enter your email"
          />
          <FormInput
            register={{ ...register('password') }}
            label="Password"
            name="password"
            type="password"
            error={errors.password?.message}
            placeholder="Password"
          />
          {/* <input type="hidden" name="_action" value="login" /> */}
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
    </>
  )
}
export default LoginForm
