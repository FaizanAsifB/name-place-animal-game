import DotsLoader from '@/components/ui/DotsLoader'
import { Button } from '@/components/ui/button'
import { AuthContext } from '@/context/AuthContext'
import { updateCurrentRound, updateGameState } from '@/utils/http'
import { ArrowRightCircle, Home } from 'lucide-react'
import { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'

type ResultsFooterProps = {
  hostId: string
  isLastRound: boolean
}

const ResultsFooter = ({ hostId, isLastRound }: ResultsFooterProps) => {
  const currentUser = useContext(AuthContext)
  const params = useParams()

  const isHost = currentUser?.uid === hostId

  async function handleNextRound() {
    await updateCurrentRound(params.roomId!)
    await updateGameState('INIT', params.roomId!)
  }

  if (!isLastRound && !isHost)
    return (
      <div className="flex items-center gap-2 mx-auto mb-4">
        <DotsLoader />
        <span className="text-lg uppercase">Waiting for host to continue</span>
      </div>
    )

  if (!isLastRound && isHost)
    return (
      <Button type="button" className="mx-auto my-6" onClick={handleNextRound}>
        <ArrowRightCircle /> Next Round
      </Button>
    )

  if (isLastRound)
    return (
      <Button asChild className="mx-auto my-6 ">
        <Link to={'/'}>
          <Home />
          Exit Game
        </Link>
      </Button>
    )

  return <div>ResultsFooter</div>
}
export default ResultsFooter
