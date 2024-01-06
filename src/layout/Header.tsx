import { Button } from '@/components/ui/button'
import { signOut } from 'firebase/auth'
import { Home } from 'lucide-react'
import { useContext } from 'react'
import { Link, useMatch } from 'react-router-dom'
import { auth } from '../config/config'
import { AuthContext } from '../context/AuthContext'

const Header = () => {
  const currentUser = useContext(AuthContext)

  const matchCreate = useMatch('game-creation')
  const matchHome = useMatch('/')
  async function signOutUser() {
    signOut(auth)
  }

  return (
    <div className="grid items-center grid-cols-4 py-8 ">
      {matchCreate && (
        <Button asChild className="w-fit">
          <Link to="/">
            <Home />
            Home
          </Link>
        </Button>
      )}
      <h1 className="col-span-2 col-start-2 text-center">
        Name Place Animal Thing
      </h1>
      {currentUser && matchHome && (
        <Button onClick={signOutUser} className="col-start-4 ml-auto w-fit">
          Logout
        </Button>
      )}
    </div>
  )
}
export default Header
