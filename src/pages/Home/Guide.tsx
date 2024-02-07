import { H2, H3 } from '@/components/typography/Headings'
import { P } from '@/components/typography/TextContent'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
// import Lottie from 'react-lottie-player/dist/LottiePlayerLight'
import { Suspense, lazy, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import guideData from '../../data/data.json'
import GuideSkeleton from './components/GuideSkeleton'

const Lottie = lazy(() => import('react-lottie-player/dist/LottiePlayerLight'))

const Guide = ({ className }: { className: string }) => {
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
    <div className={twMerge('space-y-8 text-center  ', className)}>
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
          {guideData.guide.map((item, i) => (
            <CarouselItem key={item.id}>
              <div className="flex flex-col gap-8">
                <Suspense fallback={<GuideSkeleton />}>
                  <Lottie
                    play
                    loop
                    path={item.animationUrl}
                    style={{
                      height: '250px',
                      width: '250px',
                      marginInline: 'auto',
                    }}
                  ></Lottie>
                </Suspense>

                <div>
                  <H3 className="mb-2 font-bold uppercase">
                    <span className="mr-1">{i + 1}.</span>
                    {item.title}
                  </H3>
                  <P className="px-1 text-lg text-center lg:text-xl">
                    {' '}
                    {item.description}
                  </P>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center pt-4">
          {Array.from(Array(count).keys()).map(i => (
            <button
              key={i}
              className={twMerge(
                'mx-1 h-4 aspect-square rounded-full p-0 mt-4 hover:bg-secondary/80',
                i === current - 1
                  ? 'bg-primary hover:bg-primary'
                  : 'bg-secondary'
              )}
              onClick={() => {
                api?.scrollTo(i)
              }}
            ></button>
          ))}
        </div>
      </Carousel>
    </div>
  )
}
export default Guide
