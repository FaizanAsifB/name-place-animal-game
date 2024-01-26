import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { BookText, Mail } from 'lucide-react'
import { Suspense, lazy } from 'react'

const SignInForm = lazy(() => import('./SignInForm'))
const SignUpForm = lazy(() => import('./SignUpForm'))

const AuthModal = () => {
  return (
    <div className="flex justify-center w-full gap-4 lg:gap-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button name="register" variant={'secondary'} size={'md'}>
            <BookText /> Sign Up
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Register with Email and Password</DialogTitle>
          </DialogHeader>
          {/* Sign up Form */}
          <Suspense fallback={<p>Loading....</p>}>
            <SignUpForm />
          </Suspense>
          {/* <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter> */}
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button name="login" variant={'secondary'} size={'md'}>
            <Mail /> Sign In
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="capitalize">
              Enter your Email and Password
            </DialogTitle>
          </DialogHeader>
          {/* Login form */}
          <Suspense fallback={<p>Loading....</p>}>
            <SignInForm />
          </Suspense>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default AuthModal
