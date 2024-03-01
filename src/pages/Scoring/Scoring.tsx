import { LoaderFunction, useParams } from 'react-router-dom'

import { fetchLobbyData, queryClient } from '../../utils/fetchData'

import CurrentAlphabet from '@/components/ui/CurrentAlphabet'
import GameHeader from '@/components/ui/GameHeader'

import { RoundsData } from '@/lib/types'
import { getCurrentRoundConfig } from '@/utils/helpers'

import { H1 } from '@/components/typography/Headings'
import { useQuery } from '@tanstack/react-query'
import ScoringCards from './components/ScoringCards'
import GameSkeleton from '../GameScreen/components/GameSkeleton'

const Scoring = () => {
  const params = useParams()

  const { data: roundsData, isFetching } = useQuery({
    queryKey: ['roundsData', params.roomId!, 'scoring'],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<RoundsData>(queryKey[1], 'rounds'),
    refetchOnWindowFocus: false,
  })

  return (
    <section className="relative flex flex-col flex-1 my-8">
      {isFetching || !roundsData ? (
        <GameSkeleton />
      ) : (
        <>
          <GameHeader roundsData={roundsData}>
            <H1 className="mx-auto ">Scoring</H1>
            {roundsData && (
              <CurrentAlphabet
                className="ml-auto"
                currentAlphabet={getCurrentRoundConfig(roundsData).alphabet}
              />
            )}
          </GameHeader>
          <ScoringCards roundsData={roundsData} />
        </>
      )}
    </section>
  )
}
export default Scoring

// eslint-disable-next-line react-refresh/only-export-components
export const loader: LoaderFunction = async ({ params }) => {
  const roundsData = queryClient.fetchQuery({
    queryKey: ['roundsData', params.roomId!, 'scoring'],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<RoundsData>(queryKey[1], 'rounds'),
  })

  return { roundsData }
}
