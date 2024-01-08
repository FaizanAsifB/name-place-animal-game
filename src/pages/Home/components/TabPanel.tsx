import { ReactElement, useContext } from 'react'

import { AuthContext } from '../../../context/AuthContext'

import { H3 } from '@/components/typography/Headings'
import AuthContent from './AuthContent'
import AuthModal from './AuthModal'
import AvatarSelection from './AvatarSelection'
import GuestContent from './GuestContent'

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
        <H3 className="uppercase w-[22ch] text-center">
          Choose a character and Sign
        </H3>
        <AuthModal />
      </>
    )
  }
  return (
    <div className="p-8 bg-bg-primary" role="tabpanel">
      <div aria-labelledby={showGuest ? 'guest-tab' : 'authentication-tab'}>
        <div className="grid items-center justify-center justify-items-center gap-8 lg:pt-6 lg:grid-cols-[2fr,3fr] lg:gap-8">
          <AvatarSelection />
          <div className="space-y-4">{content}</div>
        </div>
      </div>
    </div>
  )
}
export default TabPanel
