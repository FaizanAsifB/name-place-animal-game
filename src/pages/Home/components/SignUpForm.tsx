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
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useAtom } from 'jotai'
import { BookText, XCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { auth, db } from '../../../config/config'
import { avatarAtom, avatarImages } from '../../../context/atoms'
import { SignUpSchema, signUpSchema } from '../../../lib/types'

// type SignUpFormProps = {
//   onClose: () => void
// }

const SignUpForm = () => {
  const [avatarIndex] = useAtom(avatarAtom)

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      displayName: '',
      confirmPassword: '',
    },
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
        // onClose()
      } catch (error) {
        throw new Error('There was an error signing up')
      }
    } catch (error) {
      throw new Error('There was an error signing up')
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="CoolNick2022" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                <Input placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="Confirm Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="flex justify-between mt-8">
          <DialogClose asChild>
            <Button disabled={form.formState.isSubmitting}>
              <XCircle />
              Cancel
            </Button>
          </DialogClose>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            <BookText /> Register
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
export default SignUpForm
