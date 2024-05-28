import Logo from '@/components/ui/Logo.tsx'
import { Button } from '@/components/ui/button.tsx'
import { auth } from '@/config/firebaseConfig.ts'
import { AuthContext } from '@/context/AuthContext.tsx'
import { avatarAtom, displayNameAtom } from '@/context/atoms.ts'
import { deleteGuestUser } from '@/utils/authentication.ts'
import { signOut } from 'firebase/auth'
import { useAtom, useAtomValue } from 'jotai'
import { Gamepad2 } from 'lucide-react'
import { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import data from '../../data/data.json'
import Footer from '../../layout/Footer.tsx'
import Auth from './Auth.tsx'
import Guide from './Guide.tsx'
import GuideModal from './components/GuideModal.tsx'

const Home = () => {
  const currentUser = useContext(AuthContext)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const displayName = useAtomValue(displayNameAtom)
  const [_, setAvatarIndex] = useAtom(avatarAtom)

  const joinCode = searchParams.get('jc')

  useEffect(() => {
    if (currentUser?.photoURL)
      setAvatarIndex(
        data.avatarImages.findIndex(
          avatar => avatar.path === currentUser.photoURL
        )
      )
  }, [currentUser?.photoURL, setAvatarIndex])

  useEffect(() => {
    if (joinCode && displayName) navigate(`/game-room/${joinCode}/lobby`)
  }, [displayName, joinCode, navigate])

  async function signOutUser() {
    if (!currentUser) return

    if (currentUser?.isAnonymous) return await deleteGuestUser(currentUser)

    try {
      await signOut(auth)
    } catch (error) {
      throw new Error('Error signing out')
    }
  }

  return (
    <>
      <header className="grid items-center grid-cols-4 py-8 ">
        <GuideModal />

        <Logo />
        {displayName && (
          <Button
            onClick={signOutUser}
            variant={'outline'}
            className="col-start-4 ml-auto w-fit "
          >
            Logout
          </Button>
        )}
      </header>
      <section className="grid flex-1 grid-cols-5 grid-rows-[auto,1fr,auto] gap-x-6 ">
        <Auth />
        <Guide className="hidden col-start-4 row-span-2 p-4 pb-0 border-[3px] border-[rgba(0,0,0,.1)] col-span-full lg:block lg:rounded-lg lg:bg-bg-primary lg:pb-4" />

        <Footer />
      </section>
    </>
  )
}
export default Home
