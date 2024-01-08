import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { BookText, Mail } from 'lucide-react'
import { Suspense, lazy } from 'react'

const LoginForm = lazy(() => import('./LoginForm'))
const SignUpForm = lazy(() => import('./SignUpForm'))

const AuthModal = () => {
  return (
    <div className="flex justify-around w-full">
      <Dialog>
        <DialogTrigger asChild>
          <Button name="login">
            <Mail /> Sign In
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter your email and password</DialogTitle>
          </DialogHeader>
          {/* Login form */}
          <Suspense fallback={<p>Loading....</p>}>
            <LoginForm />
          </Suspense>
          {/* <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter> */}
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button name="register">
            <BookText /> Sign Up
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign up with email and password</DialogTitle>
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
    </div>
  )
}
export default AuthModal
