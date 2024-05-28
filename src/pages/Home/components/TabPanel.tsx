import { ReactElement, useContext } from 'react'

import { AuthContext } from '../../../context/AuthContext'

import { H4 } from '@/components/typography/Headings'
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
        <H4 className="uppercase max-w-[16ch] text-center ">
          Choose a character and Sign in
        </H4>

        <AuthModal />
      </>
    )

  return (
    <div
      className="grid items-center justify-center gap-2 py-8 bg-bg-primary justify-items-center lg:py-12 lg:pb-0 md:grid-cols-[auto,1fr] lg:gap-12 lg:px-6 md:px-24 md:gap-14 xl:gap-8 xl:px-24 "
      role="tabpanel"
      aria-labelledby={showGuest ? 'guest-tab' : 'authentication-tab'}
    >
      <AvatarSelection />
      <div className="flex flex-col gap-2 md:gap-12 ">{content}</div>
    </div>
  )
}
export default TabPanel
