import { useContext, useRef, useState } from 'react'
import { IoGameControllerOutline } from 'react-icons/io5'
import { PiPlugsConnectedBold } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Tab from '../../components/ui/Tab'
import { AuthContext } from '../../context/AuthContext'
import { useAtom } from 'jotai'
import {
  GameCodeSchema,
  GuestSchema,
  gameCodeSchema,
  guestSchema,
} from '../../lib/types'
import { guestSignIn } from '../../utils/auth'
import { queryData } from '../../utils/fetchData'
import { avatarAtom } from '../../utils/utils'
import Authentication from './components/Authentication'
import TabPanel from './components/TabPanel'

const Auth = () => {
  const [showGuest, setShowGuest] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const currentUser = useContext(AuthContext)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [avatarIndex] = useAtom(avatarAtom)

  if (currentUser?.email && showGuest) setShowGuest(false)

  function handleTabClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (e.currentTarget.ariaSelected == 'true') return
    setShowGuest(!showGuest)
  }

  async function handleJoinGame() {
    const gameCode: GameCodeSchema = inputRef.current!.value

    try {
      const validate = await gameCodeSchema.safeParseAsync(gameCode)

      if (!validate.success)
        return setErrorMessage(validate.error.errors[0].message)

      const res = await queryData('lobbies', {
        property: 'joinCode',
        operator: '==',
        value: validate.data,
      })

      console.log(res?.lobbyId)
      navigate(`/lobby/${res?.lobbyId}`)
    } catch (error) {
      throw new Error('There was an error creating a guest user')
    }
  }

  function handleCreateGame() {
    if (currentUser) return navigate('game-creation')
  }

  async function handleGuestLogin() {
    const displayName: GuestSchema = inputRef.current!.value

    try {
      const validate = await guestSchema.safeParseAsync(displayName)

      if (!validate.success) {
        inputRef.current?.focus()
        return setErrorMessage(validate.error.errors[0].message)
      }

      await guestSignIn(displayName, avatarIndex)
    } catch (error) {
      throw new Error('There was an error creating guest user')
    }
  }
  return (
    <>
      <div className="col-span-5 lg:col-span-3">
        <menu role="tablist" className="grid grid-cols-2 gap-2">
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
          ref={inputRef}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          showGuest={showGuest}
        />
      </div>
      <div className="flex flex-col justify-center row-start-2 gap-4 md:flex-row-reverse md:gap-8 col-span-full lg:col-span-3 place-items-center md:bg-slate-700/20 md:pb-8 md:mb-8 md:pr-4">
        {currentUser ? (
          <>
            <Button
              onClick={handleCreateGame}
              icon={<IoGameControllerOutline />}
            >
              Start
            </Button>
            <Button onClick={handleJoinGame} icon={<PiPlugsConnectedBold />}>
              Join
            </Button>
          </>
        ) : (
          <Authentication
            guestOnClick={handleGuestLogin}
            showGuest={showGuest}
          />
        )}
      </div>
    </>
  )
}
export default Auth
