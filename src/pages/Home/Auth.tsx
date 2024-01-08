import { Gamepad2 } from 'lucide-react'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Tab from '../../components/ui/Tab'
import { Button } from '../../components/ui/button.tsx'
import { AuthContext } from '../../context/AuthContext'
import TabPanel from './components/TabPanel'

const Auth = () => {
  const [showGuest, setShowGuest] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const currentUser = useContext(AuthContext)
  const navigate = useNavigate()

  if (currentUser?.email && showGuest) setShowGuest(false)

  function handleTabClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (e.currentTarget.ariaSelected == 'true') return
    setShowGuest(!showGuest)
  }

  function handleCreateGame() {
    if (currentUser) return navigate('game-creation')
  }

  return (
    <>
      <div className="col-span-5 lg:col-span-3 lg:row-span-1">
        <menu role="tablist" className="grid grid-cols-2">
          <Tab
            isActive={showGuest}
            onClick={handleTabClick}
            label="guest"
            aria-labelledby="guest-tab"
            currentUser={!!currentUser}
          >
            Guest
          </Tab>
          <Tab
            isActive={!showGuest}
            onClick={handleTabClick}
            label="authentication"
            aria-labelledby="authentication-tab"
            currentUser={!!currentUser}
          >
            Authenticate
          </Tab>
        </menu>
        <TabPanel
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          showGuest={showGuest}
        />
      </div>
      <div className="grid row-start-2 rounded-b-lg col-span-full lg:col-span-3 lg:bg-bg-primary place-items-center">
        <Button onClick={handleCreateGame} className="">
          <Gamepad2 /> New Game
        </Button>
      </div>
    </>
  )
}
export default Auth
