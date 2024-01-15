import { AUTOPLAY_SPEED, MAX_SLIDES } from '@/config/appConfig'
import { AuthContext } from '@/context/AuthContext'
import { currentAlphabetAtom } from '@/context/atoms'
import { submitSlideEnd } from '@/pages/GameCreation/utils/http'
import { alphabets } from '@/pages/Lobby/utils/utils'
import { useAtomValue } from 'jotai'
import { useContext, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Slider from 'react-slick'

type AlphabetsSliderProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  isSubmitted: boolean | undefined
}

function HiddenArrow() {
  return <div style={{ display: 'none' }} />
}

const initialSettings = {
  dots: false,
  infinite: true,
  speed: AUTOPLAY_SPEED,
  slidesToShow: 1,
  slidesToScroll: 1,
  vertical: true,
  autoplay: true,
  autoplaySpeed: AUTOPLAY_SPEED,
  nextArrow: <HiddenArrow />,
  prevArrow: <HiddenArrow />,
  waitForAnimate: false,
  fade: true,
  cssEase: 'ease-in-out',
  easing: 'ease-in-out',
}

const AlphabetsSlider = ({ isSubmitted }: AlphabetsSliderProps) => {
  const [sliderSettings, setSliderSettings] = useState(initialSettings)
  const currentAlphabet = useAtomValue(currentAlphabetAtom)
  const currentUser = useContext(AuthContext)

  const params = useParams()

  const sliderRef = useRef<Slider | null>(null)
  const alphabetCount = useRef(0)
  const currentAlphabetIndex = useRef<number | null>(null)
  const maxSlides = useRef<number | null>(null)

  currentAlphabetIndex.current = alphabets.findIndex(
    item => item === currentAlphabet
  )

  maxSlides.current = MAX_SLIDES(currentAlphabetIndex.current)

  function setAutoPlaySpeed() {
    if (!maxSlides.current) return

    switch (alphabetCount.current) {
      case maxSlides.current / 2:
        setSliderSettings(prev => ({
          ...prev,
          autoplaySpeed: AUTOPLAY_SPEED * 3,
          speed: AUTOPLAY_SPEED * 3,
        }))
        break
      case maxSlides.current - 15:
        setSliderSettings(prev => ({
          ...prev,
          autoplaySpeed: AUTOPLAY_SPEED * 5,
          speed: AUTOPLAY_SPEED * 5,
        }))
        break
      case maxSlides.current - 10:
        setSliderSettings(prev => ({
          ...prev,
          autoplaySpeed: AUTOPLAY_SPEED * 6,
          speed: AUTOPLAY_SPEED * 6,
        }))
        break
      case maxSlides.current - 5:
        setSliderSettings(prev => ({
          ...prev,
          autoplaySpeed: AUTOPLAY_SPEED * 10,
          speed: AUTOPLAY_SPEED * 10,
        }))
        break
    }
  }

  //TODO check if the timer causes delay

  async function handlePlayEnd() {
    if (!currentAlphabetIndex.current || !sliderRef.current) return
    if (alphabetCount.current === maxSlides.current && !isSubmitted) {
      sliderRef.current.slickPause()

      await submitSlideEnd(params.roomId!, currentUser?.uid)

      setTimeout(() => {
        // setOpen(false)
      }, 2000)
    }
  }

  return (
    <Slider
      ref={sliderRef}
      {...sliderSettings}
      className="h-full"
      afterChange={() => {
        alphabetCount.current++
        handlePlayEnd()
      }}
      beforeChange={() => {
        setAutoPlaySpeed()
      }}
    >
      {alphabets.map(alphabet => (
        <div key={alphabet}>
          <p className="text-[500px] text-center border-2 border-blue-400 leading-none pb-8 -pt-8">
            {alphabet}
          </p>
        </div>
      ))}
    </Slider>
  )
}
export default AlphabetsSlider
