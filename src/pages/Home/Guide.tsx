import { H3, H4 } from '@/components/typography/Headings'
import { P } from '@/components/typography/TextContent'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
// import Lottie from 'react-lottie-player/dist/LottiePlayerLight'
import clsx from 'clsx'
import { Suspense, lazy, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import guideData from '../../data/data.json'
import GuideSkeleton from './components/GuideSkeleton'

const Lottie = lazy(() => import('react-lottie-player/dist/LottiePlayerLight'))

const Guide = ({
  className,
  isModal = false,
}: {
  className: string
  isModal?: boolean
}) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [animationStyles, setAnimationStyles] = useState({
    height: '125px',
    width: '125px',
    marginInline: 'auto',
  })

  function handleAnimationStyles() {
    if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
      setAnimationStyles(prev => {
        return {
          ...prev,
          height: '200px',
          width: '200px',
        }
      })
    }
    if (window.innerWidth >= 1280) {
      setAnimationStyles(prev => {
        return {
          ...prev,
          height: '300px',
          width: '300px',
        }
      })
    }
  }
  useEffect(() => {
    handleAnimationStyles()
    window.addEventListener('resize', () => handleAnimationStyles())

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

    return window.removeEventListener('resize', () => handleAnimationStyles())
  }, [api])

  return (
    <div className={twMerge('space-y-6 text-center ', className)}>
      <H3
        className={twMerge(
          'capitalize',
          isModal ? 'text-primary-foreground' : ''
        )}
      >
        How To Play
      </H3>
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
              <div className="flex flex-col gap-2">
                <Suspense fallback={<GuideSkeleton />}>
                  <Lottie
                    play
                    loop
                    path={item.animationUrl}
                    style={animationStyles}
                  ></Lottie>
                </Suspense>

                <div>
                  <H4 className="mb-2 font-bold uppercase">
                    <span className="mr-1">{i + 1}.</span>
                    {item.title}
                  </H4>
                  <P className="px-1 text-base text-center lg:text-lg">
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
              className={clsx(
                'mx-1 h-4 aspect-square rounded-full p-0 mt-4 hover:bg-muted/80',
                i === current - 1 && !isModal
                  ? 'bg-white hover:bg-primary'
                  : 'bg-muted',
                i === current - 1 && isModal
                  ? 'bg-secondary hover:bg-secondary'
                  : 'bg-muted'
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
