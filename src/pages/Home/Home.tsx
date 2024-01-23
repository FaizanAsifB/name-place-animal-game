import { Button } from '@/components/ui/button.tsx'
import { toast } from '@/components/ui/use-toast.ts'
import { auth } from '@/config/config.ts'
import { AuthContext } from '@/context/AuthContext.tsx'
import { avatarAtom, displayNameAtom } from '@/context/atoms.ts'
import Header from '@/layout/MainHeader.tsx'
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
import { getAvatarPath } from '@/lib/utils.ts'

// grid grid-cols-5

const Home = () => {
  const currentUser = useContext(AuthContext)
  const displayName = useAtomValue(displayNameAtom)
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const joinCode = searchParams.get('jc')

  const [avatarIndex] = useAtom(avatarAtom)

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

  async function handleCreateGame() {
    if (!currentUser)
      return toast({
        variant: 'destructive',
        title: 'Authentication required!.',
        description: 'You must be logged in to create a new game.',
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    await updatePhotoUrl(currentUser!, { photoURL: getAvatarPath(avatarIndex) })

    return navigate('game-creation')
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
