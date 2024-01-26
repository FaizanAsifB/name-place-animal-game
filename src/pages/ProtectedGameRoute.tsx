import { LobbyPlayers } from '@/lib/types'
import { fetchLobbyData } from '@/utils/fetchData'
import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const currentUser = useContext(AuthContext)
  const { roomId } = useParams()

  const { data: lobbyPlayers, isPending } = useQuery({
    queryKey: ['lobbyPlayers', roomId!],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<LobbyPlayers>(queryKey[1], 'lobbyPlayers'),
  })

  const pathname = location.pathname
  const isInLobby =
    lobbyPlayers &&
    lobbyPlayers?.slots.findIndex(slot => slot.uid === currentUser?.uid) >= 0

  if (!isPending && isInLobby) return children

  if (!isPending && pathname === `/game-room/${roomId}/lobby` && currentUser)
    return children

  if (!isPending && pathname === `/game-room/${roomId}/lobby` && !currentUser)
    return <Navigate to={`/?jc=${roomId}`} />

  if (!isPending && pathname !== `/game-room/${roomId}/lobby` && !isInLobby)
    return <Navigate to="/" />
}
export default ProtectedRoute
