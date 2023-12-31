import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { BookText, Mail } from 'lucide-react'
import { Button } from '../../../components/ui/button.tsx'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'

type AuthenticationProps = {
  showGuest: boolean
  guestOnClick: () => void
}

const Authentication = ({ showGuest, guestOnClick }: AuthenticationProps) => {
  // const [isModalOpen, setIsModalOpen] = useState(false)
  // const [isSignUp, setIsSignUp] = useState(false)

  // function closeModal() {
  //   setIsModalOpen(false)
  // }

  // function openModal(e: React.MouseEvent<HTMLButtonElement>) {
  //   if (e.currentTarget!.name === 'register') setIsSignUp(true)
  //   if (e.currentTarget!.name === 'login') setIsSignUp(false)
  //   setIsModalOpen(true)
  // }

  return (
    <>
      {/* <Modal isOpen={isModalOpen} onClose={closeModal}>
        {isSignUp ? (
          <SignUpForm onClose={closeModal} />
        ) : (
          <LoginForm onClose={closeModal} />
        )}
      </Modal> */}
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
