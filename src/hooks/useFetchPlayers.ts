import { useQuery } from '@tanstack/react-query'

import { useParams } from 'react-router-dom'
import { fetchPlayers } from '../utils/fetchData'
import { PlayerData } from '../lib/types'
import { getUserInfo } from '../utils/helpers'

export const useFetchPlayers = (userId: string) => {
  const { roomId } = useParams()

  const { data, isError, error, isPending } = useQuery({
    queryKey: ['players', roomId],
    queryFn: ({ queryKey }) => fetchPlayers(queryKey[1]),
  })

  const users: PlayerData[] = data?.slots.filter((slot: PlayerData) => slot.uid)

  const userInfo = getUserInfo(users, userId)
  return { userInfo, isError, error, isPending }
}
