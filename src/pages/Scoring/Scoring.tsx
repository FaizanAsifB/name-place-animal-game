import { LoaderFunction, useLoaderData } from 'react-router-dom'

import { fetchLobbyData } from '../../utils/fetchData'

import CurrentAlphabet from '@/components/ui/CurrentAlphabet'

import GameHeader from '@/components/ui/GameHeader'

import { RoundsData } from '@/lib/types'
import { getCurrentRoundConfig } from '@/utils/helpers'

import ScoringCards from './components/ScoringCards'

const Scoring = () => {
  const { roundData } = useLoaderData() as {
    roundData: RoundsData
    roomId: string
  }

  return (
    <section className="flex flex-col flex-1 my-8 ">
      <GameHeader roundsData={roundData}>
        {roundData && (
          <CurrentAlphabet
            className="ml-auto"
            currentAlphabet={getCurrentRoundConfig(roundData).alphabet}
          />
        )}
      </GameHeader>
      <ScoringCards roundData={roundData} />
    </section>
  )
}
export default Scoring

// eslint-disable-next-line react-refresh/only-export-components
export const loader: LoaderFunction = async ({ params }) => {
  const roundData = await fetchLobbyData(params.roomId!, 'rounds')
  return { roundData, roomId: params.roomId /* , userInfo */ }
}
