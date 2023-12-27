import { useState } from 'react'
import { CgNotes } from 'react-icons/cg'
import { MdOutlineMailOutline } from 'react-icons/md'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'

type AuthenticationProps = {
  showGuest: boolean
  guestOnClick: () => void
}

const Authentication = ({ showGuest, guestOnClick }: AuthenticationProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  function closeModal() {
    setIsModalOpen(false)
  }

  function openModal(e: React.MouseEvent<HTMLButtonElement>) {
    if (e.currentTarget!.name === 'register') setIsSignUp(true)
    if (e.currentTarget!.name === 'login') setIsSignUp(false)
    setIsModalOpen(true)
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {isSignUp ? (
          <SignUpForm onClose={closeModal} />
        ) : (
          <LoginForm onClose={closeModal} />
        )}
      </Modal>
      {showGuest ? (
        <Button name="guest" onClick={guestOnClick}>
          Login as Guest
        </Button>
      ) : (
        <>
          <Button
            name="login"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => openModal(e)}
            icon={<MdOutlineMailOutline />}
          >
            Sign In
          </Button>

          <Button
            name="register"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => openModal(e)}
            icon={<CgNotes />}
          >
            Sign Up
          </Button>
        </>
      )}
    </>
  )
}
export default Authentication
