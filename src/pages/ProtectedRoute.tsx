import { useContext } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const currentUser = useContext(AuthContext)

  const location = useLocation()
  const { roomId } = useParams()

  const pathname = location.pathname

  if (pathname === `/game-room/${roomId}/lobby` && !currentUser)
    return <Navigate to={`/?c=${roomId}`} />

  if (pathname !== `/game-room/${roomId}/lobby`) return <Navigate to="/" />

  return children
}
export default ProtectedRoute
