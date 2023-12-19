import CachedIcon from '@mui/icons-material/Cached'
import { forwardRef, useContext, useState } from 'react'
import ErrorText from '../../../components/forms/ErrorText'
import { AuthContext } from '../../../context/AuthContext'
import { useOnSnapShot } from '../../../hooks/useOnSnapShot'
import { avatarAtom, displayImages } from '../../../utils/utils'
import CircularProgress from '@mui/material/CircularProgress'
import { useAtom } from 'jotai'

type TabPanelProps = {
  showGuest: boolean
  errorMessage: string
}

const TabPanel = forwardRef<HTMLInputElement, TabPanelProps>(function TabPanel(
  { showGuest, errorMessage },
  ref
) {
  const [dpIndex, setDpIndex] = useAtom(avatarAtom)
  const currentUser = useContext(AuthContext)
  const { data } = useOnSnapShot({ docRef: 'users', roomId: currentUser?.uid })

  function handleDpChange() {
    if (dpIndex === displayImages.length - 1) setDpIndex(0)
    setDpIndex(prev => prev + 1)
  }

  return (
    <div className="p-8 bg-slate-700/20" role="tabpanel">
      <div aria-labelledby={showGuest ? 'guest-tab' : 'authentication-tab'}>
        <div className="grid items-center justify-center justify-items-center gap-4 lg:pt-16 md:grid-cols-[2fr,3fr] lg:gap-8">
          <div className="relative w-40 md:w-60 lg:w-64 xl:w-[22rem] aspect-square">
            <img
              src={displayImages[dpIndex].path}
              alt="character logo"
              className="absolute bottom-0 left-0 right-0 w-full min-h-full"
            />
            <button
              className="absolute bottom-0 right-0 mr-1"
              onClick={handleDpChange}
            >
              <CachedIcon fontSize="large" />
            </button>
          </div>
          <div className="grid gap-2 place-items-center md:gap-4">
            <h2 className="text-center max-w-[20ch]">
              {currentUser ? (
                data ? (
                  `Welcome back ${data.displayName}! `
                ) : (
                  <CircularProgress />
                )
              ) : (
                `Choose a character and
              ${showGuest ? ' nickname' : ' Log in with email'}`
              )}
            </h2>
            {currentUser && (
              <>
                <p>Enter code to join!</p>
                <ErrorText>{errorMessage}</ErrorText>
                <input ref={ref} type="text" placeholder="G2F3X" />
              </>
            )}
            {showGuest && !currentUser ? (
              <>
                <ErrorText>{errorMessage}</ErrorText>
                <input
                  ref={ref}
                  className=""
                  type="text"
                  placeholder="RandomNick2002"
                />
              </>
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
