import { useContext, useState } from 'react'
import Tab from '../../components/ui/Tab'

import { AuthContext } from '../../context/AuthContext'
import TabPanel from './components/TabPanel'

const Auth = () => {
  const [showGuest, setShowGuest] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const currentUser = useContext(AuthContext)

  if (currentUser?.email && showGuest) setShowGuest(false)

  function handleTabClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (e.currentTarget.ariaSelected == 'true') return
    setShowGuest(!showGuest)
  }

  return (
    <>
      <div className="col-span-5 lg:col-span-3 lg:row-span-1 ">
        <menu role="tablist" className="grid grid-cols-2 ">
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
    </>
  )
}
export default Auth
