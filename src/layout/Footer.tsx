import { signOut } from 'firebase/auth'
import { useContext } from 'react'
import { Button } from '../components/ui/Button'
import { auth } from '../config/config'
import { AuthContext } from '../context/AuthContext'

const Footer = () => {
  const currentUser = useContext(AuthContext)
  // const navigate = useNavigate()

  async function signOutUser() {
    signOut(auth)
  }

  return (
    <footer className="flex justify-between h-12 my-8">
      Footer
      {currentUser && <Button onClick={signOutUser}>Logout</Button>}
    </footer>
  )
}
export default Footer
