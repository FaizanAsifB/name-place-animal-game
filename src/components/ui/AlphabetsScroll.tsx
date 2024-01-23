import { Dialog, DialogContent } from '@/components/ui/dialog'

import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { AuthContext } from '@/context/AuthContext'
import { CreateGameData, GameState } from '@/lib/types'
import { fetchLobbyData } from '@/utils/fetchData'
import { updateGameState } from '@/utils/http'
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

  const { data: roundsData, isPending } = useQuery({
    queryKey: ['roundsData', params.roomId],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<CreateGameData>(queryKey[1], 'rounds'),
  })

  const isSubmitted = gameState?.toStarted?.[
    `round${roundsData?.currentRound}`
  ]?.includes(currentUser?.uid ?? '')

  useEffect(() => {
    if (!gameState) return
    if (gameState.gameState === 'INIT' && !isSubmitted && !isPending)
      setOpen(true)
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
  }, [
    gameState,
    open,
    isSubmitted,
    params.roomId,
    roundsData?.currentRound,
    isPending,
  ])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-min h-min"
        onEscapeKeyDown={e => e.preventDefault()}
        visual={true}
        onPointerDownOutside={e => e.preventDefault()}
        onInteractOutside={e => e.preventDefault()}
      >
        <AlphabetsSlider isSubmitted={isSubmitted} roundsData={roundsData} />
      </DialogContent>
    </Dialog>
  )
}
export default AlphabetsScroll
