import UserInfo from '@/components/ui/UserInfo'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AuthContext } from '@/context/AuthContext'
import { ScoreData } from '@/lib/types'
import { useContext, useEffect, useState } from 'react'
import ConfettiExplosion, { ConfettiProps } from 'react-confetti-explosion'
import { Link } from 'react-router-dom'

type GameEndModalProps = {
  scoresData: [string, ScoreData][]
}

const GameEndModal = ({ scoresData }: GameEndModalProps) => {
  const [isExploding, setIsExploding] = useState(false)
  const currentUser = useContext(AuthContext)

  const winnerId = scoresData[0][0]
  const winnerScores = scoresData[0][1]
  const isCurrentWinner = winnerId === currentUser?.uid

  useEffect(() => {
    if (currentUser?.uid === scoresData[0][0]) setIsExploding(true)
  }, [currentUser?.uid, scoresData])

  const largeProps: ConfettiProps = {
    force: 0.8,
    duration: 3000,
    particleCount: 300,
    width: 1600,
    zIndex: 100,
  }

  // const user = (await ) as User

  return (
    <>
      {isExploding && (
        <ConfettiExplosion {...largeProps} className="absolute" />
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {/* <DialogTitle className="text-center">Final Result</DialogTitle> */}
          <DialogDescription>
            {/* Make changes to your profile here. Click save when you're done. */}
          </DialogDescription>
        </DialogHeader>
        {isCurrentWinner ? (
          <p className="text-4xl text-center">
            Congratulations
            <br /> YOU WON!
          </p>
        ) : (
          <div className="flex gap-2">
            <UserInfo userId={currentUser!.uid} />
            <span> Won</span>
          </div>
        )}
        <p className="text-center">With {winnerScores.totalScore} points</p>
        <DialogFooter>
          <DialogClose>
            <Button>Close</Button>
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
