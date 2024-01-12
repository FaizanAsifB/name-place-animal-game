import { Dialog, DialogContent } from '@/components/ui/dialog'

import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { useState } from 'react'
import AlphabetsSlider from './AlphabetsSlider'

const AlphabetsScroll = () => {
  const [open, setOpen] = useState(true)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent visual={true}>
        <AlphabetsSlider setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}
export default AlphabetsScroll
