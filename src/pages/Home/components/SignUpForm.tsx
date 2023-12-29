import { zodResolver } from '@hookform/resolvers/zod'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useForm } from 'react-hook-form'
import Button from '../../../components/ui/Button'
import FormInput from '../../../components/ui/FormInput'
import { auth, db } from '../../../config/config'
import { SignUpSchema, signUpSchema } from '../../../lib/types'
import { useAtom } from 'jotai'
import { avatarAtom, avatarImages } from '../../../utils/utils'

type SignUpFormProps = {
  onClose: () => void
}

const SignUpForm = ({ onClose }: SignUpFormProps) => {
  const [avatarIndex] = useAtom(avatarAtom)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpSchema) => {
    const { displayName, email, password } = data

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      try {
        await updateProfile(res.user, {
          displayName,
          photoURL: avatarImages[avatarIndex].path,
        })

        await setDoc(doc(db, 'users', res.user.uid), {
          uid: res.user.uid,
          displayName,
          email,
          photoURL: res.user.photoURL,
          isAnonymous: res.user.isAnonymous,
        })
        onClose()
      } catch (error) {
        throw new Error('There was an error signing up')
      }
    } catch (error) {
      throw new Error('There was an error signing up')
    }
  }

  return (
    <>
      <h2 className="mb-4">Sign up</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul className="flex flex-col gap-4">
          <FormInput
            register={{ ...register('displayName') }}
            type="text"
            label="Display Name"
            name="displayName"
            error={errors.displayName?.message}
            placeholder="CoolNick2022"
          />
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
          <FormInput
            register={{ ...register('confirmPassword') }}
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            error={errors.confirmPassword?.message}
            placeholder="Confirm Password"
          />
          {/* <input type="hidden" name="_action" value="register" /> */}
        </ul>
        <menu className="flex justify-between mt-8">
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Register
          </Button>
        </menu>
      </form>
    </>
  )
}
export default SignUpForm
