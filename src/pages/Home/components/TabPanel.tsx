import { ReactElement, useContext } from 'react'

import { AuthContext } from '../../../context/AuthContext'

import AuthContent from './AuthContent'
import AuthModal from './AuthModal'
import AvatarSelection from './AvatarSelection'
import GuestContent from './GuestContent'
import { H2 } from '@/components/typography/Headings'

type TabPanelProps = {
  showGuest: boolean
  errorMessage: string
  setErrorMessage: (value: string) => void
}

const TabPanel = ({ showGuest }: TabPanelProps) => {
  const currentUser = useContext(AuthContext)

  let content: ReactElement | string = ''

  if (currentUser) {
    content = <AuthContent displayName={currentUser?.displayName} />
  } else if (showGuest) {
    content = <GuestContent />
  } else {
    content = (
      <>
        <H2 className="uppercase w-[22ch] text-center">
          Choose a character and Sign{/*  in with email */}
        </H2>
        <AuthModal />
      </>
    )
  }
  return (
    <div className="p-8 bg-bg-primary" role="tabpanel">
      <div aria-labelledby={showGuest ? 'guest-tab' : 'authentication-tab'}>
        <div className="grid items-center justify-center justify-items-center gap-4 lg:pt-16 lg:grid-cols-[2fr,3fr] lg:gap-8">
          <AvatarSelection />
          <div className="grid gap-2 place-items-center lg:gap-4">
            {content}
          </div>
        </div>
      </div>
    </div>
  )
}
export default TabPanel
