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
import { zodResolver } from '@hookform/resolvers/zod'
import { FirebaseError } from 'firebase/app'
import { sendPasswordResetEmail } from 'firebase/auth'
import { Mail } from 'lucide-react'
import { Dispatch } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { auth } from '../../../../config/firebaseConfig'
import { loginSchema } from '../../../../lib/types'

const forgottenPasswordSchema = loginSchema.pick({ email: true })
type ForgotPasswordFormProps = {
  setShowForgottenPassword: Dispatch<React.SetStateAction<boolean>>
}

const ForgotPasswordForm = ({
  setShowForgottenPassword,
}: ForgotPasswordFormProps) => {
  const form = useForm<z.infer<typeof forgottenPasswordSchema>>({
    resolver: zodResolver(forgottenPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (
    formData: z.infer<typeof forgottenPasswordSchema>
  ) => {
    const { email } = formData

    //TODO add to zod
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      if (error instanceof FirebaseError)
        form.setError(
          'email',
          {
            type: 'custom',
            message: 'There was an error resetting your password',
          },
          { shouldFocus: true }
        )
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="capitalize">Enter your Email</DialogTitle>
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

            <DialogFooter className="items-center pt-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                variant={'secondary'}
                size={'sm'}
                onClick={() => setShowForgottenPassword(false)}
              >
                <Mail /> Back
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                variant={'secondary'}
                size={'sm'}
                className=""
              >
                <Mail /> Send
              </Button>
            </DialogFooter>
          </ul>
        </form>
      </Form>
    </>
  )
}
export default ForgotPasswordForm
