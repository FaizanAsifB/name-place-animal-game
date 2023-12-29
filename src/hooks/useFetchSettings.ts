import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { fetchLobbyData } from '../utils/fetchData'

export const useFetchSettings = () => {
  const params = useParams()
  const roomId: string = params.roomId!

  return useQuery({
    queryKey: ['settings', roomId],
    queryFn: ({ queryKey }) => fetchLobbyData(queryKey[1], 'lobbies'),
  })
}
