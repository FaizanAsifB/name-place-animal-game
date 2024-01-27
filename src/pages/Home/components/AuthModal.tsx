import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { BookText, Mail } from 'lucide-react'
import { Suspense, lazy, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ForgotPasswordForm from './forms/ForgotPasswordForm'

const SignInForm = lazy(() => import('./forms/SignInForm'))
const SignUpForm = lazy(() => import('./forms/SignUpForm'))

const AuthModal = () => {
  const [showForgottenPassword, setShowForgottenPassword] = useState(false)

  return (
    <div className="flex justify-center w-full gap-4 lg:gap-6">
      {/* Sign up Form */}
      <Dialog>
        <DialogTrigger asChild>
          <Button name="register" variant={'secondary'} size={'md'}>
            <BookText /> Sign Up
          </Button>
        </DialogTrigger>

        <Suspense fallback={<p>Loading....</p>}>
          <SignUpForm />
        </Suspense>
      </Dialog>

      {/* Login form */}
      <Dialog>
        <DialogTrigger asChild>
          <Button name="login" variant={'secondary'} size={'md'}>
            <Mail /> Sign In
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <Suspense fallback={<p>Loading....</p>}>
            {!showForgottenPassword && (
              <SignInForm setShowForgottenPassword={setShowForgottenPassword} />
            )}
            {showForgottenPassword && (
              <ForgotPasswordForm
                setShowForgottenPassword={setShowForgottenPassword}
              />
            )}
          </Suspense>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default AuthModal
