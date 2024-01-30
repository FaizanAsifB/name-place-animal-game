import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
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
import { Input } from '@/components/ui/input'
import { SignUpType, signUpSchema } from '@/lib/types'
import { emailSignUp } from '@/utils/authentication'
import { zodResolver } from '@hookform/resolvers/zod'
import { FirebaseError } from 'firebase/app'
import { useAtom, useSetAtom } from 'jotai'
import { BookText, XCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { avatarAtom, displayNameAtom } from '../../../../context/atoms'

type SignUpFromProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SignUpForm = ({ setOpen }: SignUpFromProps) => {
  const [avatarIndex] = useAtom(avatarAtom)
  const userDisplayName = useSetAtom(displayNameAtom)

  const form = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      displayName: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: SignUpType) => {
    try {
      const displayName = await emailSignUp(data, avatarIndex)
      toast.success('Sign up was successful')
      userDisplayName(displayName)
      setOpen(false)
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === 'auth/email-already-in-use'
      )
        form.setError(
          'email',
          {
            type: 'custom',
            message: 'Email already in use',
          },
          { shouldFocus: true }
        )
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Register with Email and Password</DialogTitle>
      </DialogHeader>
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
                  <Input type="password" placeholder="Password" {...field} />
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
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-8">
            <DialogClose asChild>
              <Button
                variant={'secondary'}
                size={'md'}
                disabled={form.formState.isSubmitting}
              >
                <XCircle />
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              variant={'secondary'}
              size={'md'}
            >
              <BookText /> Register
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
export default SignUpForm
