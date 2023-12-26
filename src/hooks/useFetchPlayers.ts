import { useQuery } from '@tanstack/react-query'

import { useParams } from 'react-router-dom'
import { fetchPlayers } from '../utils/fetchData'
import { PlayerData } from '../lib/types'

export const useFetchPlayers = () => {
  const { roomId } = useParams()

  const { data, isError, error, isPending } = useQuery({
    queryKey: ['players', roomId],
    queryFn: ({ queryKey }) => fetchPlayers(queryKey[1]),
  })

  const userInfo: PlayerData[] = data?.slots.filter(
    (slot: PlayerData) => slot.uid
  )
  return { userInfo, isError, error, isPending }
}
