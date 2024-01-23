import { useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'

const JoinGame = () => {
  const currentUser = useContext(AuthContext)

  return (
    <>
      <h2 className="text-center max-w-[20ch]"></h2>
      Welcome back {currentUser?.displayName}
      <p>Enter code to join!</p>
      <input className="" type="text" placeholder="G2F3X" />
    </>
  )
}
export default JoinGame
