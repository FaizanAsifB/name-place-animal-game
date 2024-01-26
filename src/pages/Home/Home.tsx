import { Button } from '@/components/ui/button.tsx'
import { toast } from '@/components/ui/use-toast.ts'
import { auth } from '@/config/firebaseConfig.ts'
import { AuthContext } from '@/context/AuthContext.tsx'
import { avatarAtom, displayNameAtom } from '@/context/atoms.ts'
import { deleteGuestUser, updatePhotoUrl } from '@/utils/authentication.ts'
import { signOut } from 'firebase/auth'
import { useAtom, useAtomValue } from 'jotai'
import { Gamepad2 } from 'lucide-react'
import { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Footer from '../../layout/Footer.tsx'
import Auth from './Auth.tsx'
import Guide from './Guide.tsx'
import GuideModal from './components/GuideModal.tsx'
import Logo from '@/components/ui/Logo.tsx'
import { getAvatarPath } from '@/utils/helpers.tsx'

// grid grid-cols-5

const Home = () => {
  const currentUser = useContext(AuthContext)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const displayName = useAtomValue(displayNameAtom)
  const [avatarIndex] = useAtom(avatarAtom)

  const joinCode = searchParams.get('jc')

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

  async function handleCreateGame() {
    if (!currentUser)
      return toast({
        variant: 'destructive',
        title: 'Authentication required!.',
        description: 'You must be logged in to create a new game.',
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    await updatePhotoUrl(currentUser, { photoURL: getAvatarPath(avatarIndex) })

    return navigate('game-creation')
  }

  return (
    <>
      <header className="grid items-center grid-cols-4 py-8 ">
        <GuideModal />
        <Logo />
        {displayName && (
          <Button onClick={signOutUser} className="col-start-4 ml-auto w-fit">
            Logout
          </Button>
        )}
      </header>
      <div className="grid flex-1 grid-cols-5 grid-rows-[auto,1fr,auto] gap-x-6">
        <Auth />
        <Guide className="hidden col-start-4 row-span-2 p-4 pb-0 border-2 col-span-full lg:block" />
        <div className="grid row-start-2 rounded-b-lg col-span-full lg:col-span-3 lg:bg-bg-primary place-items-center">
          <Button onClick={handleCreateGame}>
            <Gamepad2 /> <span>Start</span>
          </Button>
        </div>
        <Footer />
      </div>
    </>
  )
}
export default Home
