import { Dialog, DialogContent } from '@/components/ui/dialog'

import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { AuthContext } from '@/context/AuthContext'
import { GameState } from '@/lib/types'
import { updateGameState } from '@/pages/GameCreation/utils/http'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AlphabetsSlider from './AlphabetsSlider'

type AlphabetsScrollProps = {
  gameState: GameState | undefined
}

const AlphabetsScroll = ({ gameState }: AlphabetsScrollProps) => {
  const [open, setOpen] = useState(false)

  const currentUser = useContext(AuthContext)
  const params = useParams()

  const isSubmitted = gameState?.toStarted?.includes(currentUser?.uid ?? '')

  useEffect(() => {
    if (!gameState) return
    if (gameState.gameState === 'INIT' && !isSubmitted) setOpen(true)
    // if (open && gameState.gameState !== 'INIT') setOpen(false)
    if (
      gameState.toStarted?.length === gameState.totalPlayers &&
      gameState.gameState !== 'STARTED'
    ) {
      setTimeout(() => {
        updateGameState('STARTED', params.roomId)
      }, 2000)
    }
  }, [gameState, open, isSubmitted, params.roomId])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-min h-min" /* visual={true} */>
        <AlphabetsSlider setOpen={setOpen} isSubmitted={isSubmitted} />
      </DialogContent>
    </Dialog>
  )
}
export default AlphabetsScroll
