import { H2, H3 } from '@/components/typography/Headings'
import UserInfo from '@/components/ui/UserInfo'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog'
import { AuthContext } from '@/context/AuthContext'
import { GameState, ScoreData } from '@/lib/types'
import { updateGameState } from '@/pages/GameCreation/utils/http'
import { useContext, useEffect, useMemo, useState } from 'react'
import ConfettiExplosion, { ConfettiProps } from 'react-confetti-explosion'
import { Link, useParams } from 'react-router-dom'

type GameEndModalProps = {
  scoresData: [string, ScoreData][] | undefined
  isLastRound: boolean
  gameState: GameState | undefined
}

const GameEndModal = ({
  scoresData,
  isLastRound,
  gameState,
}: GameEndModalProps) => {
  const [isExploding, setIsExploding] = useState(false)

  const params = useParams()
  const currentUser = useContext(AuthContext)

  const winnerId = scoresData?.[0][0]
  const winnerScores = scoresData?.[0][1]
  const isCurrentUserWinner = winnerId === currentUser?.uid
  const currentUserScores = useMemo(() => {
    if (currentUser)
      return scoresData?.find(item => item[0] === currentUser?.uid)
  }, [currentUser, scoresData])

  useEffect(() => {
    if (
      isCurrentUserWinner &&
      isLastRound &&
      gameState &&
      gameState?.gameState !== 'GAME-COMPLETED'
    ) {
      setIsExploding(true)
      updateGameState('GAME-COMPLETED', params?.roomId)
    }
  }, [isCurrentUserWinner, isLastRound, gameState, params?.roomId])

  const largeProps: ConfettiProps = {
    force: 0.8,
    duration: 3000,
    particleCount: 300,
    width: 1600,
    zIndex: 100,
  }

  return (
    <>
      {isExploding && (
        <ConfettiExplosion
          {...largeProps}
          className="absolute left-1/2 top-1/4"
        />
      )}
      <DialogContent className="sm:max-w-[425px]">
        {isCurrentUserWinner ? (
          <>
            <H2 className="text-center uppercase">Congratulations</H2>
            <H3 className="text-center uppercase">YOU WON!</H3>
          </>
        ) : (
          <>
            <H2 className="text-center uppercase">The winner is</H2>
            <UserInfo userId={winnerId!} className="justify-center" />
            <p className="font-semibold text-center capitalize">
              Their final score: {winnerScores?.totalScore}
            </p>
          </>
        )}
        <p className="py-4 font-semibold text-center capitalize">
          {currentUserScores &&
            `Your final score: ${currentUserScores[1].totalScore}`}
        </p>
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
          <Button asChild>
            <Link to="/">Exit Game</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  )
}
export default GameEndModal
