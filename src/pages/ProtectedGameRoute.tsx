import { GameState, LobbyPlayers } from '@/lib/types'
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
  const { data: gameData, isPending: isPendingGameData } = useQuery({
    queryKey: ['gameRooms', roomId!],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<GameState>(queryKey[1], 'gameRooms'),
  })

  // const pathname = location.pathname
  const isInLobby =
    lobbyPlayers &&
    lobbyPlayers?.slots.findIndex(slot => slot.uid === currentUser?.uid) >= 0

  if (!isPendingGameData && gameData?.gameState === 'GAME-COMPLETED')
    return <Navigate to="/" replace />

  if (!isPendingGameData && gameData?.gameState === 'LOBBY' && !currentUser)
    return <Navigate to={`/?jc=${roomId}`} replace />

  if (!isPendingGameData && currentUser && gameData?.gameState === 'LOBBY')
    return children

  if (
    !isPending &&
    !isPendingGameData &&
    gameData?.gameState !== 'LOBBY' &&
    isInLobby
  )
    return children

  if (
    !isPending &&
    !isPendingGameData &&
    gameData?.gameState !== 'LOBBY' &&
    !isInLobby
  )
    return <Navigate to="/" replace />

  // if (!isPendingGameData && gameData?.gameState !== 'LOBBY')
  //   return <Navigate to="/" replace />
}
export default ProtectedRoute
