import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { fetchLobbyData } from '../utils/fetchData'
import { GameSettings } from '../lib/types'

export const useFetchSettings = () => {
  const params = useParams()
  const roomId: string = params.roomId!

  return useQuery({
    queryKey: ['settings', roomId],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<GameSettings>(queryKey[1], 'lobbies'),
  })
}
