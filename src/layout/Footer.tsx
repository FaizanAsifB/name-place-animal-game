import { signOut } from 'firebase/auth'
import { useContext } from 'react'
import Button from '../components/ui/Button'
import { auth } from '../config/config'
import { AuthContext } from '../context/AuthContext'

const Footer = () => {
  const currentUser = useContext(AuthContext)
  // const navigate = useNavigate()

  async function signOutUser() {
    signOut(auth)
    console.log(currentUser)
  }

  return (
    <footer className="justify-between hidden h-12 lg:flex">
      Footer
      {currentUser && <Button onClick={signOutUser}>Logout</Button>}
    </footer>
  )
}
export default Footer
