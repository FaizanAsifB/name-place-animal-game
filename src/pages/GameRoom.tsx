import GameHeader from '@/components/ui/GameHeader'
import { Outlet } from 'react-router-dom'

const GameRoom = () => {
  return (
    <>
      <GameHeader />
      <Outlet />
    </>
  )
}
export default GameRoom
