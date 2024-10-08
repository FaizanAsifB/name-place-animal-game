import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const currentUser = useContext(AuthContext)

  if (!currentUser) return <Navigate to={'/'} replace />

  return children
}
export default ProtectedRoute
