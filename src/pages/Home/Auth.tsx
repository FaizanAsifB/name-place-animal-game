import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Tab from '../../components/ui/Tab'
import { Button } from '../../components/ui/button.tsx'
import { AuthContext } from '../../context/AuthContext'
import TabPanel from './components/TabPanel'
import { Gamepad2 } from 'lucide-react'

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
      <div className="col-span-5 lg:col-span-3">
        <menu role="tablist" className="grid grid-cols-2 gap-2">
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
      <div className="grid flex-1 rounded-b-lg basis-full lg:bg-bg-primary place-items-center">
        <Button
          onClick={handleCreateGame}
          variant={'icon'}
          size={'lg'}
          className="shadow-[0_6px_0px_0px] shadow-blue-500 active:translate-y-1 active:shadow-[0_2px_0px_0px] active:shadow-blue-500"
        >
          <Gamepad2 /> New Game
        </Button>
        {/* <Button onClick={handleJoinGame}>Join</Button> */}
      </div>
    </>
  )
}
export default Auth
