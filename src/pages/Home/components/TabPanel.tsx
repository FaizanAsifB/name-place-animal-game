import { ReactElement, useContext } from 'react'

import { AuthContext } from '../../../context/AuthContext'

import { H4 } from '@/components/typography/Headings'
import { avatarAtom, displayNameAtom } from '@/context/atoms'
import { useAtom, useAtomValue } from 'jotai'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { updatePhotoUrl } from '@/utils/authentication'
import { getAvatarPath } from '@/utils/helpers'
import { Gamepad2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
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
  const [avatarIndex] = useAtom(avatarAtom)

  const currentUser = useContext(AuthContext)
  const navigate = useNavigate()

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

  async function handleCreateGame() {
    if (!currentUser)
      return toast({
        variant: 'destructive',
        title: 'Authentication required!.',
        description: 'You must be logged in to create a new game.',
      })
    await updatePhotoUrl(currentUser, {
      photoURL: getAvatarPath(avatarIndex),
    })

    return navigate('game-creation')
  }

  return (
    <div
      className="grid items-center justify-center justify-items-center md:justify-items-start gap-2 py-8 bg-bg-primary  lg:py-12 md:grid-cols-[auto,1fr] lg:gap-12 lg:px-6 md:px-12 md:gap-x-16 xl:gap-x-24 xl:gap-y-0 xl:px-24 rounded-b-lg flex-1"
      role="tabpanel"
      aria-labelledby={showGuest ? 'guest-tab' : 'authentication-tab'}
    >
      <AvatarSelection />
      <div className="flex flex-col gap-2 md:gap-12 ">{content}</div>
      <div className="grid w-full pt-12 mx-auto rounded-b-lg md:pt-16 col-span-full place-items-center">
        {displayName && (
          <Button onClick={handleCreateGame} className="text-base lg:text-lg">
            <Gamepad2 className="w-8 h-8 lg:h-10 lg:w-10" /> Start
          </Button>
        )}
      </div>
    </div>
  )
}
export default TabPanel
