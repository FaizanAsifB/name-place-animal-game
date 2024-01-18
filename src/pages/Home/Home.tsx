import { Button } from '@/components/ui/button.tsx'
import { auth } from '@/config/config.ts'
import { AuthContext } from '@/context/AuthContext.tsx'
import { displayNameAtom } from '@/context/atoms.ts'
import Header from '@/layout/MainHeader.tsx'
import { deleteGuestUser } from '@/utils/auth.ts'
import { signOut } from 'firebase/auth'
import { useAtomValue } from 'jotai'
import { useContext, useEffect } from 'react'
import Footer from '../../layout/Footer.tsx'
import Auth from './Auth.tsx'
import Guide from './Guide.tsx'
import GuideModal from './components/GuideModal.tsx'
import { useNavigate, useSearchParams } from 'react-router-dom'

// grid grid-cols-5

const Home = () => {
  const currentUser = useContext(AuthContext)
  const displayName = useAtomValue(displayNameAtom)
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()

  const joinCode = searchParams.get('c')

  console.log(joinCode)

  useEffect(() => {
    if (joinCode && displayName) navigate(`/game-room/${joinCode}/lobby`)
  }, [displayName, joinCode, navigate])

  async function signOutUser() {
    try {
      await signOut(auth)
      await deleteGuestUser(currentUser!)
    } catch (error) {
      throw new Error('Error signing out')
    }
  }

  return (
    <>
      <Header>
        <GuideModal />
        {displayName && (
          <Button onClick={signOutUser} className="col-start-4 ml-auto w-fit">
            Logout
          </Button>
        )}
      </Header>
      <div className="grid flex-1 grid-cols-5 grid-rows-[auto,1fr,auto] gap-x-6">
        <Auth />
        <Guide className="hidden col-start-4 row-span-2 p-4 pb-0 border-2 col-span-full lg:block" />
        <Footer />
      </div>
    </>
  )
}
export default Home
