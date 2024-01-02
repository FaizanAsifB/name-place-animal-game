import { useQuery } from '@tanstack/react-query'

import { useParams } from 'react-router-dom'
import { PlayerData } from '../lib/types'
import { fetchPlayers } from '../utils/fetchData'

export const useFetchPlayers = () => {
  const params = useParams()
  const { data, isError, error, isPending } = useQuery({
    queryKey: ['players', params.roomId],
    queryFn: ({ queryKey }) => fetchPlayers(queryKey[1]),
  })

  const users: PlayerData[] = data?.slots.filter((slot: PlayerData) => slot.uid)

  return { users, isError, error, isPending }
}
