import { ReactElement, useContext } from 'react'

import { AuthContext } from '../../../context/AuthContext'

import { H3 } from '@/components/typography/Headings'
import { displayNameAtom } from '@/context/atoms'
import { useAtomValue } from 'jotai'

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

  const displayName = useAtomValue(displayNameAtom)
  let content: ReactElement | string = ''

  if (currentUser && displayName) {
    content = <AuthContent />
  }
  if (!displayName && showGuest) {
    content = <GuestContent />
  }
  if (!displayName && !showGuest)
    content = (
      <>
        <H3 className="uppercase w-[22ch] text-center">
          Choose a character and Sign in
        </H3>

        <AuthModal />
      </>
    )

  return (
    <div
      className=" bg-bg-primary grid items-center justify-center justify-items-center gap-10 p-12 lg:p-20 xl:grid-cols-[2fr,3fr] lg:gap-16 md:gap-12 xl:px-8"
      role="tabpanel"
      aria-labelledby={showGuest ? 'guest-tab' : 'authentication-tab'}
    >
      <AvatarSelection />
      <div className="space-y-8 md:space-y-10 lg:space-y-12 xl:space-y-16">
        {content}
      </div>
    </div>
  )
}
export default TabPanel
