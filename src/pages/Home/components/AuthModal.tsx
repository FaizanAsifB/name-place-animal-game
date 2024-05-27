import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { BookText, Mail } from 'lucide-react'
import { Suspense, lazy, useState } from 'react'
import ForgotPasswordForm from './forms/ForgotPasswordForm'

const SignInForm = lazy(() => import('./forms/SignInForm'))
const SignUpForm = lazy(() => import('./forms/SignUpForm'))

const AuthModal = () => {
  const [open, setOpen] = useState(false)
  const [showForgottenPassword, setShowForgottenPassword] = useState(false)

  return (
    <div className="flex items-center justify-center w-full gap-4 lg:gap-6">
      {/* Sign up Form */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button name="register" variant={'link'} size={'none'}>
            <BookText /> Sign Up
          </Button>
        </DialogTrigger>

        <Suspense fallback={<p>Loading....</p>}>
          <SignUpForm setOpen={setOpen} />
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
              <SignInForm
                setShowForgottenPassword={setShowForgottenPassword}
                setOpen={setOpen}
              />
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
