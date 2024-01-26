import { AUTOPLAY_SPEED, MAX_SLIDES } from '@/config/gameConfig'
import { AuthContext } from '@/context/AuthContext'
import { CreateGameData } from '@/lib/types'

import { alphabets } from '@/pages/Lobby/utils/utils'
import {
  getCurrentRoundConfig,
  getFromSessionStorage,
  saveToSessionStorage,
} from '@/utils/helpers'
import { submitSlideEnd } from '@/utils/http'
import { useContext, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Slider from 'react-slick'

type AlphabetsSliderProps = {
  isSubmitted: boolean | undefined
  roundsData: CreateGameData | undefined
}

function HiddenArrow() {
  return <div style={{ display: 'none' }} />
}

const initialSettings = {
  dots: false,
  draggable: false,
  pauseOnHover: false,
  speed: 0,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipe: false,
  vertical: true,
  touchMove: false,
  autoplay: true,
  autoplaySpeed: AUTOPLAY_SPEED,
  nextArrow: <HiddenArrow />,
  prevArrow: <HiddenArrow />,
  waitForAnimate: false,
  fade: false,
  easing: 'linear',
}

const AlphabetsSlider = ({ isSubmitted, roundsData }: AlphabetsSliderProps) => {
  const [sliderSettings, setSliderSettings] = useState(initialSettings)
  const params = useParams()

  const currentUser = useContext(AuthContext)

  const sliderRef = useRef<Slider | null>(null)
  const alphabetCount = useRef(0)
  const currentAlphabetIndex = useRef<number | null>(null)
  const maxSlides = useRef<number | null>(null)

  currentAlphabetIndex.current = alphabets.findIndex(
    item => item === getCurrentRoundConfig(roundsData!).alphabet
  )

  const alphabetCountInStorage = getFromSessionStorage<number>(
    `alphabet${params.roomId}${roundsData?.currentRound}`
  )

  function setSlide() {
    if (alphabetCountInStorage) alphabetCount.current = alphabetCountInStorage
    sliderRef.current?.slickGoTo(alphabetCount.current + 1)
  }

  maxSlides.current = MAX_SLIDES(currentAlphabetIndex.current)

  function setAutoPlaySpeed() {
    if (!maxSlides.current) return

    switch (alphabetCount.current) {
      case maxSlides.current - 15:
        setSliderSettings(prev => ({
          ...prev,
          autoplaySpeed: AUTOPLAY_SPEED * 3,
        }))
        break
      case maxSlides.current - 10:
        setSliderSettings(prev => ({
          ...prev,
          autoplaySpeed: AUTOPLAY_SPEED * 5,
        }))
        break
      case maxSlides.current - 5:
        setSliderSettings(prev => ({
          ...prev,
          autoplaySpeed: AUTOPLAY_SPEED * 6,
        }))
        break
      case maxSlides.current - 2:
        setSliderSettings(prev => ({
          ...prev,
          autoplaySpeed: AUTOPLAY_SPEED * 10,
        }))
        break
    }
  }

  async function handlePlayEnd() {
    if (alphabetCount.current === maxSlides.current && !isSubmitted) {
      sliderRef.current?.slickPause()

      await submitSlideEnd(
        params.roomId!,
        currentUser?.uid,
        roundsData!.currentRound
      )
    }
  }

  return (
    <Slider
      ref={sliderRef}
      {...sliderSettings}
      className=""
      onInit={setSlide}
      afterChange={() => {
        alphabetCount.current++
        saveToSessionStorage(
          'alphabet' + params.roomId + roundsData?.currentRound,
          alphabetCount.current
        )
        handlePlayEnd()
      }}
      beforeChange={() => {
        setAutoPlaySpeed()
      }}
    >
      {alphabets.map(alphabet => (
        <div key={alphabet}>
          <p className="text-[250px] lg:text-[500px] text-center leading-none -mt-8 pb-2 md:text-[500px] ">
            {alphabet}
          </p>
        </div>
      ))}
    </Slider>
  )
}
export default AlphabetsSlider
