import { Toaster } from '@/components/ui/sonner'
import { Outlet } from 'react-router-dom'

const GameRoom = () => {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  )
}
export default GameRoom
