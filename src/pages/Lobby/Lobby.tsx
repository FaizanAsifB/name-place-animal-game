import { useOnSnapShot } from '@/hooks/useOnSnapShot.ts'

import DotsLoader from '@/components/ui/DotsLoader.tsx'
import { AuthContext } from '@/context/AuthContext.tsx'
import { addedCategoriesAtom, categoriesAtom } from '@/context/atoms.ts'
import MainHeader from '@/layout/MainHeader.tsx'
import { useMutation } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AlphabetsScroll from '../../components/ui/AlphabetsScroll.tsx'
import { Button } from '../../components/ui/button.tsx'
import useNextPhase from '../../hooks/useNextPhase'
import {
  Categories,
  CreateGameData,
  GameSettings,
  PlayersData,
  ScoresData,
} from '../../lib/types'
import { fetchLobbyData } from '../../utils/fetchData'
import { createRoundsData, updateGameState } from '../GameCreation/utils/http'
import CategoriesList from './components/CategoriesList'
import InviteDropDown from './components/InviteDropDown.tsx'
import PlayerSlots from './components/PlayerSlots'
import SettingsList from './components/SettingsList'
import {
  calcReadyPlayers,
  categoriesArr,
  getAllCategories,
  getRoundsConfig,
} from './utils/utils'

const Lobby = () => {
  const { params, data: gameState, fireStoreError } = useNextPhase()

  const { data: lobbyPlayers /* error */ } = useOnSnapShot<PlayersData>({
    docRef: 'lobbyPlayers',
    roomId: params.roomId,
  })

  const { data /* error */ } = useOnSnapShot<Categories>({
    docRef: 'categories',
    roomId: params.roomId!,
  })

  const { mutate } = useMutation({
    mutationFn: createRoundsData,
    onSuccess: async () => {
      await updateGameState('INIT', params.roomId!)
    },
  })

  const navigate = useNavigate()
  const currentUser = useContext(AuthContext)

  const categoriesData = useSetAtom(categoriesAtom)
  const addedCategories = useSetAtom(addedCategoriesAtom)

  useEffect(() => {
    if (!data) return
    categoriesData(data)
    addedCategories(getAllCategories(data))
  }, [addedCategories, categoriesData, data])

  const isHost = lobbyPlayers?.hostId === currentUser?.uid

  const readyPlayers = calcReadyPlayers(lobbyPlayers)
  const totalPlayers = gameState?.totalPlayers
  const allPlayersReady = readyPlayers === totalPlayers

  //TODO implement delete lobby logic
  function handleLobbyCancel() {
    //Delete lobby data

    //Return to Home
    navigate('/')
  }

  async function handlePlay() {
    const categoriesData = await fetchLobbyData<Categories>(
      params.roomId!,
      'categories'
    )
    const settingsData = await fetchLobbyData<GameSettings>(
      params.roomId!,
      'lobbies'
    )
    const customCategories = categoriesArr(categoriesData)

    const initialScoresData: ScoresData = {}

    for (const slot of lobbyPlayers.slots) {
      if (slot.displayName)
        initialScoresData[slot.uid] = {
          scoresCategory: [],
          scoreRounds: [],
          totalScore: 0,
        }
    }

    const roundData: CreateGameData = {
      currentRound: 1,
      roundsConfig: getRoundsConfig(
        customCategories!,
        settingsData!.settings.rounds.value,
        categoriesData!.default
      ),
      scores: initialScoresData,
    }

    mutate({ lobbyId: params.roomId!, data: roundData })

    return
  }

  return (
    <>
      <MainHeader hasHomeButton onClick={handleLobbyCancel} />
      <div className="my-4 space-y-8 rounded-lg md:text-lg lg:text-xl">
        {gameState?.gameState === 'INIT' && (
          <AlphabetsScroll gameState={gameState} />
        )}
        <div className="grid gap-y-4 md:gap-x-4 md:grid-cols-5 md:grid-rows-3 xl:grid-cols-6">
          <PlayerSlots data={lobbyPlayers} error={fireStoreError} />

          <CategoriesList />
          <SettingsList />
        </div>
        {isHost && (
          <footer className="flex justify-around">
            <InviteDropDown roomId={params?.roomId} />
            <Button
              disabled={!allPlayersReady || !isHost}
              onClick={handlePlay}
              variant={'secondary'}
            >
              {allPlayersReady ? (
                <span>Play</span>
              ) : (
                <span>
                  {readyPlayers}/{totalPlayers} Ready
                </span>
              )}
            </Button>
          </footer>
        )}
        {!isHost && (
          <footer className="flex w-full">
            <div className="mx-auto">
              <div>
                {!allPlayersReady &&
                  `${readyPlayers}/${totalPlayers} Players Ready`}

                {allPlayersReady && gameState?.gameState !== 'INIT' ? (
                  <p className="flex items-center gap-2 mx-auto mb-4">
                    <DotsLoader />
                    <span className="text-lg uppercase">
                      Waiting for host to start the game
                    </span>
                  </p>
                ) : (
                  ''
                )}
              </div>
            </div>
          </footer>
        )}
      </div>
    </>
  )
}
export default Lobby
