import { useContext, useRef, useState } from 'react'
import { IoGameControllerOutline } from 'react-icons/io5'
import { PiPlugsConnectedBold } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Tab from '../../components/ui/Tab'
import { AuthContext } from '../../context/AuthContext'

import AuthModal from './components/AuthModal'

import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../backend/firebase'
import { GameCodeSchema, GuestSchema, guestSchema } from '../../lib/types'
import { guestSignIn } from '../../utils/auth'
import TabPanel from './components/TabPanel'

const Auth = () => {
  const [showGuest, setShowGuest] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const currentUser = useContext(AuthContext)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  function handleTabClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (e.currentTarget.ariaSelected == 'true') return
    setShowGuest(!showGuest)
  }
  async function handleJoinGame() {
    const gameCode: GameCodeSchema = inputRef.current!.value

    if (!guestSchema.safeParse(gameCode).success)
      return setErrorMessage('Please enter a valid nickname')

    if (guestSchema.safeParse(gameCode).success) {
      const q = query(
        collection(db, 'lobbies'),
        where('joinCode', '==', gameCode)
      )
      try {
        const querySnapshot = await getDocs(q)
        let lobbyId
        querySnapshot.forEach(doc => {
          console.log(doc.id)

          lobbyId = doc.id
        })
        if (!lobbyId) return setErrorMessage('Enter a valid gameCode')
        return navigate(`/lobby/${lobbyId}`)
      } catch (error) {
        console.log(error)
      }
    }
  }

  async function handleCreateGame() {
    if (currentUser) return navigate('/game-creation')

    errorMessage && setErrorMessage('')

    const displayName: GuestSchema = inputRef.current!.value

    if (!guestSchema.safeParse(displayName).success)
      return setErrorMessage('Please enter a valid nickname')

    if (guestSchema.safeParse(displayName).success) {
      try {
        guestSignIn(displayName)
        return navigate('game-creation')
      } catch (error) {
        throw new Error('There was an error creating a guest user')
      }
    }
  }

  return (
    <>
      <div className="col-span-5 lg:col-span-3">
        <ul role="tablist" className="grid grid-cols-2 gap-2">
          <Tab
            isActive={showGuest}
            onClick={handleTabClick}
            label="guest"
            aria-labelledby="guest-tab"
          >
            Guest
          </Tab>
          <Tab
            isActive={!showGuest}
            onClick={handleTabClick}
            label="authentication"
            aria-labelledby="authentication-tab"
          >
            Authenticate
          </Tab>
        </ul>
        <TabPanel
          ref={inputRef}
          errorMessage={errorMessage}
          showGuest={showGuest}
        />
      </div>
      <div className="flex flex-col justify-center row-start-2 gap-4 md:flex-row-reverse md:gap-8 col-span-full lg:col-span-3 place-items-center md:bg-slate-700/20 md:pb-8 md:mb-8 md:pr-4">
        {showGuest || currentUser ? (
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
          <AuthModal />
        )}
      </div>
    </>
  )
}
export default Auth
