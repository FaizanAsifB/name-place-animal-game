import GameHeader from '@/components/ui/GameHeader'
import { Outlet } from 'react-router-dom'

const Game = () => {
  return (
    <>
      <GameHeader />
      <Outlet />
    </>
  )
}
export default Game
