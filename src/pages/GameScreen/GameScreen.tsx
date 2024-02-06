import { useParams } from 'react-router-dom'
import { GameSettings, RoundsData } from '../../lib/types'
import { fetchLobbyData } from '../../utils/fetchData'

import { H1 } from '@/components/typography/Headings'
import GameHeader from '@/components/ui/GameHeader'
import { currentAlphabetAtom } from '@/context/atoms'
import useNextPhase from '@/hooks/useNextPhase'
import { calcRoundTime, getCurrentRoundConfig } from '@/utils/helpers'
import { useAtom } from 'jotai'
import { useContext, useEffect, useRef, useState } from 'react'
import Clock from './components/Clock'

import CurrentAlphabet from '@/components/ui/CurrentAlphabet'
import UserInfo from '@/components/ui/UserInfo'
import { AuthContext } from '@/context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import AnswerCards from './components/AnswerCards'
import GameSkeleton from './components/GameSkeleton'

const GameScreen = () => {
  const [isFlashing, setIsFlashing] = useState(false)
  const { roomId } = useParams() as { roomId: string }

  const { data: gameData } = useNextPhase()
  const currentUser = useContext(AuthContext)

  const { data: roundsData, isFetching } = useQuery({
    queryKey: ['roundsData', roomId],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<RoundsData>(queryKey[1], 'rounds'),
  })

  const { data: settings, isFetching: isFetchingSettings } = useQuery({
    queryKey: ['lobbies', roomId],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<GameSettings>(queryKey[1], 'lobbies'),
  })

  const currentRound = `round${roundsData?.currentRound}`
  const bonusUser = gameData?.bonusPoints?.[currentRound]?.userId

  const audioRef = useRef<null | HTMLAudioElement>(null)
  const activeCategories =
    roundsData && getCurrentRoundConfig(roundsData).activeCategories.length
  const roundTime = calcRoundTime(
    activeCategories,
    settings?.settings.roundTime.value
  )

  const [currentAlphabet, setCurrentAlphabet] = useAtom(currentAlphabetAtom)

  useEffect(() => {
    if (roundsData) {
      const currentAlphabet = getCurrentRoundConfig(roundsData).alphabet
      setCurrentAlphabet(currentAlphabet)
    }
  }, [roundsData, setCurrentAlphabet])

  useEffect(() => {
    if (
      gameData?.gameState === 'END-TIMER' &&
      bonusUser &&
      bonusUser !== currentUser?.uid
    )
      setIsFlashing(true)

    if (gameData?.gameState === 'END-TIMER' && bonusUser)
      toast(
        <>
          <UserInfo userId={bonusUser} />
          <span className="font-semibold uppercase">
            Has triggered fastest finger
          </span>
        </>,
        { position: 'top-center' }
      )
  }, [
    gameData?.gameState,
    gameData?.bonusPoints,
    roundsData?.currentRound,
    currentUser?.uid,
    currentRound,
    bonusUser,
  ])

  return (
    <section className="flex flex-col flex-1 my-6 ">
      {isFetching || isFetchingSettings || !gameData ? (
        <GameSkeleton />
      ) : (
        <>
          <GameHeader roundsData={roundsData}>
            {gameData && settings && roundsData && (
              <Clock
                roundTime={roundTime!}
                gameState={gameData?.gameState}
                currentRound={roundsData?.currentRound}
              />
            )}
          </GameHeader>

          <article className="relative px-4 basis-full bg-bg-primary">
            {isFlashing && (
              <div className="absolute inset-0 z-20 pointer-events-none bg-red-500/30 animate-flash">
                <audio
                  src="/audio/siren.wav"
                  autoPlay
                  onPlay={() => (audioRef.current!.volume = 0.1)}
                  loop
                  preload="metadata"
                  ref={audioRef}
                />
              </div>
            )}
            <div className="flex items-center justify-between pt-6 pb-8 md:pb-12 lg:pb-16 lg:pt-8">
              <H1>
                Round {roundsData?.currentRound}/
                {roundsData?.roundsConfig.length}
              </H1>
              <CurrentAlphabet currentAlphabet={currentAlphabet} />
            </div>
            {
              <AnswerCards
                gameData={gameData}
                roundsData={roundsData!}
                endMode={settings!.settings.endMode.value}
              />
            }
          </article>
        </>
      )}
    </section>
  )
}
export default GameScreen
