import { forwardRef, useContext } from 'react'
import ErrorText from '../../../components/forms/ErrorText'

import { AuthContext } from '../../../context/AuthContext'

import AvatarSelection from './AvatarSelection'

type TabPanelProps = {
  showGuest: boolean
  errorMessage: string
  setErrorMessage: (value: string) => void
}

const TabPanel = forwardRef<HTMLInputElement, TabPanelProps>(function TabPanel(
  { showGuest, errorMessage, setErrorMessage },
  ref
) {
  const currentUser = useContext(AuthContext)
  // const { data } = useOnSnapShot({ docRef: 'users', roomId: currentUser?.uid })

  return (
    <div className="p-8 bg-bg-dark" role="tabpanel">
      <div aria-labelledby={showGuest ? 'guest-tab' : 'authentication-tab'}>
        <div className="grid items-center justify-center justify-items-center gap-4 lg:pt-16 md:grid-cols-[2fr,3fr] lg:gap-8">
          <AvatarSelection />
          <div className="grid gap-2 place-items-center md:gap-4">
            <h2 className="text-center max-w-[20ch]">
              {currentUser?.displayName
                ? `Welcome back ${currentUser.displayName}! `
                : `Choose a character and ${
                    showGuest ? ' nickname' : ' Log in with email'
                  }`}
            </h2>

            {currentUser && <p>Enter code to join!</p>}
            <div className="relative">
              <ErrorText align={'right'}>{errorMessage}</ErrorText>
              {currentUser ? (
                <input
                  name="joinRoom"
                  onChangeCapture={() => setErrorMessage('')}
                  ref={ref}
                  type="text"
                  placeholder="G2F3X"
                />
              ) : showGuest ? (
                <input
                  name="createGuest"
                  onChangeCapture={() => setErrorMessage('')}
                  ref={ref}
                  className=""
                  type="text"
                  placeholder="RandomNick2002"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
export default TabPanel
