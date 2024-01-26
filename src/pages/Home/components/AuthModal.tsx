import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { BookText, Mail } from 'lucide-react'
import { Suspense, lazy } from 'react'

const SignInForm = lazy(() => import('./forms/SignInForm'))
const SignUpForm = lazy(() => import('./forms/SignUpForm'))

const AuthModal = () => {
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

        <Suspense fallback={<p>Loading....</p>}>
          <SignInForm />
        </Suspense>
      </Dialog>
    </div>
  )
}
export default AuthModal
