import { DialogContent } from '@/components/ui/dialog.tsx'
import { useState } from 'react'
import SignInForm from './forms/SignInForm'

const SignInModal = () => {
  const [forgotPassword, setForgotPassword] = useState(false)

  return (
    <DialogContent className="sm:max-w-[425px]">
      {!forgotPassword && <SignInForm />}
      {forgotPassword && <ForgotPassword />}
    </DialogContent>
  )
}
export default SignInModal
