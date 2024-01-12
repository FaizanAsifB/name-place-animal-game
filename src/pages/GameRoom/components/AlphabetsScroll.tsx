import { Dialog, DialogContent } from '@/components/ui/dialog'

import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { useEffect, useState } from 'react'
import AlphabetsSlider from './AlphabetsSlider'
import { GameStates } from '@/lib/types'

type AlphabetsScrollProps = {
  gameState: GameStates | undefined
}

const AlphabetsScroll = ({ gameState }: AlphabetsScrollProps) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (gameState === 'INIT') setOpen(true)
    if (open && gameState !== 'INIT') setOpen(false)
  }, [gameState, open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent visual={true}>
        <AlphabetsSlider setOpen={setOpen} gameState={gameState} />
      </DialogContent>
    </Dialog>
  )
}
export default AlphabetsScroll
