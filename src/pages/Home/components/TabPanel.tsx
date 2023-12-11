import { forwardRef, useContext } from 'react'
import characterImg from '../../../assets/imgs/koala.svg'
import ErrorText from '../../../components/forms/ErrorText'
import { AuthContext } from '../../../context/AuthContext'

type TabPanelProps = {
  showGuest: boolean
  errorMessage: string
}

const TabPanel = forwardRef<HTMLInputElement, TabPanelProps>(function TabPanel(
  { showGuest, errorMessage },
  ref
) {
  const currentUser = useContext(AuthContext)

  return (
    <div className="p-8 bg-slate-700/20" role="tabpanel">
      <div aria-labelledby={showGuest ? 'guest-tab' : 'authentication-tab'}>
        <div className="grid items-center justify-center justify-items-center gap-4 ;lg:pt-16 md:grid-cols-[2fr,3fr] lg:gap-8">
          <img
            src={characterImg}
            alt="character logo"
            className="w-40 md:w-60 lg:w-64 xl:w-[22rem]"
          />
          <div className="grid gap-2 place-items-center md:gap-4">
            <h2 className="text-center max-w-[20ch]">
              {currentUser
                ? `Welcome back ${currentUser?.displayName}! `
                : `Choose a character and
              ${showGuest ? ' nickname' : ' Log in with email'}`}
            </h2>
            {currentUser && (
              <>
                <p>Enter code to join!</p>
                <ErrorText>{errorMessage}</ErrorText>
                <input ref={ref} className="" type="text" placeholder="G2F3X" />
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
