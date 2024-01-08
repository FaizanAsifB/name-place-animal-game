import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

import { H2, H3 } from '@/components/typography/Headings'
import { P } from '@/components/typography/TextContent'
import { Button } from '@/components/ui/button'
// import { Player } from '@lottiefiles/react-lottie-player'
import { Loader2 } from 'lucide-react'
import { Suspense, lazy, useEffect, useState } from 'react'
import data from '../../data/data.json'

const Player = lazy(() =>
  import('@lottiefiles/react-lottie-player').then(module => ({
    default: module.Player,
  }))
)

type GuideProps = {
  className: string
}

const Guide = ({ className }: GuideProps) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    //!Check this error
    // api.on('autoplay:stop', api.plugins().autoplay.play())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className={`space-y-8 text-center ${className}`}>
      <H2 className="capitalize">How To Play</H2>
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
      >
        <CarouselContent>
          {data.guide.map((item, i) => (
            <CarouselItem key={item.id}>
              <div className="flex flex-col gap-8">
                <Suspense fallback={<Loader2 />}>
                  <Player
                    autoplay
                    loop
                    src={item.animationUrl}
                    style={{ height: '200px', width: '200px' }}
                  ></Player>
                </Suspense>

                <div>
                  <H3 className="mb-2 font-bold uppercase">
                    <span className="mr-1">{i + 1}.</span>
                    {item.title}
                  </H3>
                  <P className="px-1 text-center"> {item.description}</P>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center">
          {Array.from(Array(count).keys()).map(i => (
            <Button
              variant={'icon'}
              key={i}
              className={`mx-1 h-4 aspect-square rounded-full p-0 mt-4 ${
                i === current - 1
                  ? 'bg-primary hover:bg-primary/90'
                  : 'bg-secondary'
              }`}
              onClick={() => {
                api?.scrollTo(i)
              }}
            ></Button>
          ))}
        </div>
      </Carousel>
    </div>
  )
}
export default Guide
