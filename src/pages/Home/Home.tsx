import { Button } from '@/components/ui/button.tsx'
import { auth } from '@/config/config.ts'
import { AuthContext } from '@/context/AuthContext.tsx'
import Header from '@/layout/MainHeader.tsx'
import { signOut } from 'firebase/auth'
import { useContext } from 'react'
import Footer from '../../layout/Footer.tsx'
import Auth from './Auth.tsx'
import Guide from './Guide.tsx'
import GuideModal from './components/GuideModal.tsx'

// grid grid-cols-5

const Home = () => {
  const currentUser = useContext(AuthContext)
  async function signOutUser() {
    signOut(auth)
  }

  return (
    <>
      <Header>
        <GuideModal />
        {currentUser && (
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
