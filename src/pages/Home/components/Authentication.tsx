import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { BookText, Mail } from 'lucide-react'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import { Button } from '@/components/ui/button'

type AuthenticationProps = {
  showGuest: boolean
  guestOnClick: () => void
}

const Authentication = ({ showGuest, guestOnClick }: AuthenticationProps) => {
  return (
    <>
      {showGuest ? (
        <Button name="guest" onClick={guestOnClick}>
          Login as Guest
        </Button>
      ) : (
        <>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                name="login"
                // onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                //   openModal(e)
                // }
              >
                <Mail /> Sign In
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Enter your email and password</DialogTitle>
              </DialogHeader>
              <LoginForm />
              {/* <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter> */}
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                name="register"
                // onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                //   openModal(e)
                // }
              >
                <BookText /> Sign Up
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Sign up with email and password</DialogTitle>
              </DialogHeader>
              <SignUpForm />
              {/* <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter> */}
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  )
}
export default Authentication
