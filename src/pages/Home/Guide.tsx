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

const Guide = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    // api.on('autoplay:stop', api.plugins().autoplay.play())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="hidden p-4 space-y-8 text-center border-2 lg:col-start-4 lg:row-span-2 col-span-full lg:pb-0 md:block">
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
              <div className="flex gap-8 lg:flex-col">
                {/* <img src="" alt="" className="w-56 mx-auto" />
                 */}
                <Suspense fallback={<Loader2 />}>
                  <Player
                    autoplay
                    loop
                    src={item.animationUrl}
                    style={{ height: '300px', width: '300px' }}
                  ></Player>
                </Suspense>

                <div>
                  <H3 className="mb-2 text-2xl font-bold uppercase">
                    <span className="mr-1">{i + 1}.</span>
                    {item.title}
                  </H3>
                  <P className="text-xl"> {item.description}</P>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {Array.from(Array(count).keys()).map(i => (
          <Button
            key={i}
            className={`mx-1 h-4 aspect-square flex-grow rounded-full p-0 mt-4 ${
              i === current - 1
                ? 'bg-white hover:bg-white'
                : 'bg-neutral-600/75'
            }`}
            onClick={() => {
              api?.scrollTo(i)
            }}
          ></Button>
        ))}
      </Carousel>
    </div>
  )
}
export default Guide
