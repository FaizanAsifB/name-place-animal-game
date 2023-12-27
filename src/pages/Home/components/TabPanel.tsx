import CircularProgress from '@mui/material/CircularProgress'
import { useAtom } from 'jotai'
import { forwardRef, useContext } from 'react'
import ErrorText from '../../../components/forms/ErrorText'
import { AuthContext } from '../../../context/AuthContext'
import { useOnSnapShot } from '../../../hooks/useOnSnapShot'
import { avatarAtom, displayImages } from '../../../utils/utils'
import AvatarSelection from './AvatarSelection'

type TabPanelProps = {
  showGuest: boolean
  errorMessage: string
}

const TabPanel = forwardRef<HTMLInputElement, TabPanelProps>(function TabPanel(
  { showGuest, errorMessage },
  ref
) {
  const currentUser = useContext(AuthContext)
  const { data } = useOnSnapShot({ docRef: 'users', roomId: currentUser?.uid })

  return (
    <div className="p-8 bg-slate-700/20" role="tabpanel">
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
            {currentUser && (
              <>
                <p>Enter code to join!</p>
                <div className="relative">
                  <ErrorText align={'right'}>{errorMessage}</ErrorText>
                  <input ref={ref} type="text" placeholder="G2F3X" />
                </div>
              </>
            )}
            {showGuest && !currentUser ? (
              <div className="relative">
                <ErrorText align={'right'}>{errorMessage}</ErrorText>
                <input
                  ref={ref}
                  className=""
                  type="text"
                  placeholder="RandomNick2002"
                />
              </div>
            ) : (
              <>
                <p className="md:hidden">Some Text</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
export default TabPanel
