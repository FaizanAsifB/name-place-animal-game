import { AUTOPLAY_SPEED, MAX_SLIDES } from '@/config/appConfig'
import { AuthContext } from '@/context/AuthContext'
import { CreateGameData } from '@/lib/types'
import { submitSlideEnd } from '@/pages/GameCreation/utils/http'
import { alphabets } from '@/pages/Lobby/utils/utils'
import { fetchLobbyData } from '@/utils/fetchData'
import { getCurrentRoundConfig } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
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
  speed: 0,
  slidesToShow: 1,
  slidesToScroll: 1,
  vertical: true,
  autoplay: true,
  autoplaySpeed: AUTOPLAY_SPEED,
  nextArrow: <HiddenArrow />,
  prevArrow: <HiddenArrow />,
  waitForAnimate: false,
  fade: false,
  easing: 'linear',
}

const AlphabetsSlider = ({ isSubmitted }: AlphabetsSliderProps) => {
  const [sliderSettings, setSliderSettings] = useState(initialSettings)
  const params = useParams()

  const { data: roundsData } = useQuery({
    queryKey: ['roundsData', params.roomId],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<CreateGameData>(queryKey[1], 'rounds'),
  })

  const currentUser = useContext(AuthContext)

  const sliderRef = useRef<Slider | null>(null)
  const alphabetCount = useRef(0)
  const currentAlphabetIndex = useRef<number | null>(null)
  const maxSlides = useRef<number | null>(null)

  currentAlphabetIndex.current = alphabets.findIndex(
    item => item === getCurrentRoundConfig(roundsData)?.alphabet
  )

  maxSlides.current = MAX_SLIDES(currentAlphabetIndex.current)

  function setAutoPlaySpeed() {
    if (!maxSlides.current) return

    switch (alphabetCount.current) {
      case maxSlides.current / 2:
        setSliderSettings(prev => ({
          ...prev,
          autoplaySpeed: AUTOPLAY_SPEED * 3,
          // speed: AUTOPLAY_SPEED * 3,
        }))
        break
      case maxSlides.current - 15:
        setSliderSettings(prev => ({
          ...prev,
          autoplaySpeed: AUTOPLAY_SPEED * 5,
          // speed: AUTOPLAY_SPEED * 5,
        }))
        break
      case maxSlides.current - 10:
        setSliderSettings(prev => ({
          ...prev,
          autoplaySpeed: AUTOPLAY_SPEED * 6,
          // speed: AUTOPLAY_SPEED * 6,
        }))
        break
      case maxSlides.current - 5:
        setSliderSettings(prev => ({
          ...prev,
          autoplaySpeed: AUTOPLAY_SPEED * 10,
          // speed: AUTOPLAY_SPEED * 10,
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
    }
  }

  return (
    <Slider
      ref={sliderRef}
      {...sliderSettings}
      className=""
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
          <p className="text-[250px] lg:text-[500px] text-center leading-none -mt-8 pb-2 md:text-[500px] ">
            {alphabet}
          </p>
        </div>
      ))}
    </Slider>
  )
}
export default AlphabetsSlider
// pb - 8 - pt - 8
