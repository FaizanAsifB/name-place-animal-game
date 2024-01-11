import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { alphabets } from '@/pages/Lobby/utils/utils'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useState } from 'react'

const AlphabetsScroll = () => {
  const [open, setOpen] = useState(true)

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {alphabets.map(alphabet => (
          <Slider {...settings} key={alphabet}>
            <div>{alphabet}</div>
          </Slider>
        ))}
      </DialogContent>
    </Dialog>
  )
}
export default AlphabetsScroll
