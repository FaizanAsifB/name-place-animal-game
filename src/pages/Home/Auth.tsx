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
      <div className="flex flex-col justify-center row-start-2 gap-4 md:flex-row-reverse md:gap-8 col-span-full lg:col-span-3 place-items-center md:bg-bg-primary md:rounded-b-lg">
        <Button onClick={handleCreateGame} size={'lg'}>
          Start
        </Button>
        {/* <Button onClick={handleJoinGame}>Join</Button> */}
      </div>
    </>
  )
}
export default Auth
