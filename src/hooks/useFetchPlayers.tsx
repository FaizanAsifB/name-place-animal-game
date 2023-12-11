import { useQuery } from '@tanstack/react-query'

import { useParams } from 'react-router-dom'
import { fetchPlayers } from '../utils/fetchData'

export const useFetchPlayers = () => {
  const { roomId } = useParams()

  const query = useQuery({
    queryKey: ['players', { roomId }],
    queryFn: () => fetchPlayers(roomId!),
    refetchInterval: 1000,
  })
  return query
}
