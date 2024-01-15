import { useOnSnapShot } from '@/hooks/useOnSnapShot.ts'

import { H1 } from '@/components/typography/Headings.tsx'
import { AuthContext } from '@/context/AuthContext.tsx'
import { addedCategoriesAtom, categoriesAtom } from '@/context/atoms.ts'
import { useSetAtom } from 'jotai'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button.tsx'
import useNextPhase from '../../hooks/useNextPhase'
import {
  Categories,
  CreateGameData,
  GameSettings,
  PlayersData,
} from '../../lib/types'
import { fetchLobbyData } from '../../utils/fetchData'
import {
  createRoundsData,
  createScoresData,
  updateGameState,
} from '../GameCreation/utils/http'
import AlphabetsScroll from '../GameRoom/components/AlphabetsScroll.tsx'
import CategoriesList from './components/CategoriesList'
import PlayerSlots from './components/PlayerSlots'
import SettingsList from './components/SettingsList'
import {
  categoriesArr,
  getAllCategories,
  getRoundsConfig,
  readyPlayers,
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

  const categoriesData = useSetAtom(categoriesAtom)
  const addedCategories = useSetAtom(addedCategoriesAtom)

  useEffect(() => {
    if (!data) return
    categoriesData(data)
    addedCategories(getAllCategories(data))
  }, [addedCategories, categoriesData, data])

  const navigate = useNavigate()
  const currentUser = useContext(AuthContext)

  const ready = readyPlayers(lobbyPlayers)
  const totalPlayers = gameState?.totalPlayers

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
    const roundSelections = getRoundsConfig(
      customCategories!,
      settingsData?.settings.rounds.value,
      categoriesData.default
    )

    const roundData: CreateGameData = {
      currentRound: 1,
      roundsConfig: roundSelections,
    }

    await createRoundsData(params.roomId!, roundData)

    lobbyPlayers?.slots.map(async slot => {
      if (slot.displayName) await createScoresData(params.roomId!, slot.uid)
    })
    await updateGameState('INIT', params.roomId!)
  }

  return (
    <div className="my-4 space-y-8 rounded-lg md:text-lg lg:text-xl">
      <AlphabetsScroll gameState={gameState} />

      <H1 className="text-center">Lobby</H1>
      <div className="grid mx-4 lg:mx-8 gap-y-4 md:gap-x-4 md:grid-cols-5 md:grid-rows-3 xl:grid-cols-6">
        <PlayerSlots data={lobbyPlayers} error={fireStoreError} />

        <CategoriesList />
        <SettingsList />
      </div>
      <div className="flex justify-around">
        <Button onClick={handleLobbyCancel}>
          {currentUser?.uid === lobbyPlayers?.hostId ? 'Cancel' : 'Leave'}
        </Button>
        <Button
          disabled={
            ready !== totalPlayers || currentUser?.uid != lobbyPlayers?.hostId
          }
          onClick={handlePlay}
          variant={'secondary'}
        >
          <span>
            {ready}/{totalPlayers}
          </span>
          <span>{ready !== totalPlayers ? 'Ready' : 'Play'}</span>
        </Button>
      </div>
    </div>
  )
}
export default Lobby
