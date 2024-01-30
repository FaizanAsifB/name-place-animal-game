import { useParams } from 'react-router-dom'
import { GameSettings, RoundsData } from '../../lib/types'
import { fetchLobbyData } from '../../utils/fetchData'

import { H1 } from '@/components/typography/Headings'
import GameHeader from '@/components/ui/GameHeader'
import { currentAlphabetAtom } from '@/context/atoms'
import useNextPhase from '@/hooks/useNextPhase'
import { getCurrentRoundConfig } from '@/utils/helpers'
import { useAtom } from 'jotai'
import { useContext, useEffect, useRef } from 'react'
import Clock from './components/Clock'

import CurrentAlphabet from '@/components/ui/CurrentAlphabet'
import UserInfo from '@/components/ui/UserInfo'
import { AuthContext } from '@/context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import AnswerCards from './components/AnswerCards'

const GameScreen = () => {
  const { roomId } = useParams() as { roomId: string }

  const {
    data: roundsData,
    /*    isPending,
    isFetching, */
  } = useQuery({
    queryKey: ['roundsData', roomId],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<RoundsData>(queryKey[1], 'rounds'),
  })
  const currentUser = useContext(AuthContext)

  const {
    data: settings,
    /*     isPending: isPendingSettings,
    isFetching: isFetchingSettings, */
  } = useQuery({
    queryKey: ['lobbies', roomId],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<GameSettings>(queryKey[1], 'lobbies'),
  })

  const audioRef = useRef<null | HTMLAudioElement>(null)
  const bonusUser = useRef<null | string>(null)

  const { data: gameData } = useNextPhase()

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
      audioRef.current &&
      roundsData?.bonusPoints?.[`round${roundsData?.currentRound}`]
    ) {
      audioRef.current.volume = 0.1
      bonusUser.current =
        roundsData?.bonusPoints[`round${roundsData?.currentRound}`].userId
      toast(
        <>
          <UserInfo userId={bonusUser.current} />
          <span className="font-semibold uppercase">
            Has triggered fastest finger
          </span>
        </>,
        { position: 'top-center' }
      )
    }
  }, [gameData?.gameState, roundsData?.bonusPoints, roundsData?.currentRound])

  return (
    <section className="flex flex-col flex-1 my-6 ">
      {
        <GameHeader roundsData={roundsData}>
          {gameData && settings && roundsData && (
            <Clock
              roundTime={settings?.settings.roundTime.value}
              gameState={gameData?.gameState}
              currentRound={roundsData?.currentRound}
            />
          )}
        </GameHeader>
      }
      <article className="relative px-4 basis-full bg-bg-primary">
        {gameData?.gameState === 'END-TIMER' &&
          bonusUser.current !== currentUser?.uid && (
            <div className="absolute inset-0 z-20 pointer-events-none bg-red-500/30 animate-flash">
              <audio
                src="/audio/siren.wav"
                autoPlay
                loop
                preload="metadata"
                ref={audioRef}
              />
            </div>
          )}
        <div className="flex items-center justify-between pt-6 pb-8 md:pb-12 lg:pb-16 lg:pt-8">
          <H1>
            Round {roundsData?.currentRound}/{roundsData?.roundsConfig.length}
          </H1>
          <CurrentAlphabet currentAlphabet={currentAlphabet} />
        </div>
        {gameData && roundsData && settings && (
          <AnswerCards
            gameData={gameData}
            roundsData={roundsData}
            endMode={settings.settings.endMode.value}
          />
        )}
      </article>
    </section>
  )
}
export default GameScreen

// eslint-disable-next-line react-refresh/only-export-components
/* export const loader: LoaderFunction = async ({ params }) => {
  const roundsData = await queryClient.fetchQuery({
    queryKey: ['roundsData', params.roomId!],
    queryFn: ({ queryKey }) =>
    fetchLobbyData<RoundsData | GameScreenRoundsData>(queryKey[1], 'rounds'),
  })
  
  const settings = await queryClient.fetchQuery({
    queryKey: ['lobbies', params.roomId!],
    queryFn: ({ queryKey }) =>
      fetchLobbyData<GameSettings>(queryKey[1], 'lobbies'),
  })

  return { roundsData, settings }
}
 */
