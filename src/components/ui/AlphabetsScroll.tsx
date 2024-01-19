import { Dialog, DialogContent } from '@/components/ui/dialog'

import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { AuthContext } from '@/context/AuthContext'
import { CreateGameData, GameState } from '@/lib/types'
import { updateGameState } from '@/pages/GameCreation/utils/http'
import { fetchLobbyData } from '@/utils/fetchData'
import { useQuery } from '@tanstack/react-query'
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

  const { data: roundsData } = useQuery({
    queryKey: ['roundsData', params.roomId],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<CreateGameData>(queryKey[1], 'rounds'),
  })

  const isSubmitted = gameState?.toStarted?.[
    `round${roundsData?.currentRound}`
  ]?.includes(currentUser?.uid ?? '')

  useEffect(() => {
    if (!gameState) return
    if (gameState.gameState === 'INIT' && !isSubmitted && roundsData)
      setOpen(true)
    // if (open && gameState.gameState !== 'INIT') setOpen(false)
    if (
      gameState.toStarted?.[`round${roundsData?.currentRound}`]?.length ===
        gameState.totalPlayers &&
      gameState.gameState !== 'STARTED'
    ) {
      const unsub = setTimeout(() => {
        updateGameState('STARTED', params.roomId)
      }, 2000)
      return () => clearInterval(unsub)
    }
  }, [gameState, open, isSubmitted, params.roomId, roundsData])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-min h-min"
        onEscapeKeyDown={e => e.preventDefault()}
        visual={true}
        onPointerDownOutside={e => e.preventDefault()}
        onInteractOutside={e => e.preventDefault()}
      >
        <AlphabetsSlider
          setOpen={setOpen}
          isSubmitted={isSubmitted}
          roundsData={roundsData}
        />
      </DialogContent>
    </Dialog>
  )
}
export default AlphabetsScroll
