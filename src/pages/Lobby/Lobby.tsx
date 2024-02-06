import { useOnSnapShot } from '@/hooks/useOnSnapShot.ts'

import HomeButton from '@/components/ui/HomeButton.tsx'
import Logo from '@/components/ui/Logo.tsx'
import { addedCategoriesAtom, categoriesAtom } from '@/context/atoms.ts'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import AlphabetsScroll from '../../components/ui/AlphabetsScroll.tsx'
import useNextPhase from '../../hooks/useNextPhase'
import { Categories, PlayersData } from '../../lib/types'
import CategoriesList from './components/CategoriesList'
import LobbyFooter from './components/LobbyFooter.tsx'
import LobbySkeleton from './components/LobbySkeleton.tsx'
import PlayerSlots from './components/PlayerSlots'
import SettingsList from './components/SettingsList'
import { getAllCategories } from './utils/utils'

const Lobby = () => {
  const { params, data: gameState, fireStoreError } = useNextPhase()

  const { data: lobbyPlayers } = useOnSnapShot<PlayersData>({
    docRef: 'lobbyPlayers',
    roomId: params.roomId,
  })

  const { data: categories } = useOnSnapShot<Categories>({
    docRef: 'categories',
    roomId: params.roomId!,
  })

  const categoriesData = useSetAtom(categoriesAtom)
  const addedCategories = useSetAtom(addedCategoriesAtom)

  useEffect(() => {
    if (!categories) return
    categoriesData(categories)
    addedCategories(getAllCategories(categories))
  }, [addedCategories, categoriesData, categories])

  return !lobbyPlayers || !categories || !gameState ? (
    <LobbySkeleton />
  ) : (
    <>
      <header className="grid items-center grid-cols-4 py-8 ">
        <Logo />
        <HomeButton lobbyPlayers={lobbyPlayers} />
      </header>
      <div className="my-4 space-y-8 rounded-lg md:text-lg lg:text-xl">
        {gameState?.gameState === 'INIT' && (
          <AlphabetsScroll gameState={gameState} />
        )}
        <section className="grid gap-y-4 md:gap-x-4 md:grid-cols-5 md:grid-rows-3 xl:grid-cols-6">
          <PlayerSlots data={lobbyPlayers} error={fireStoreError} />

          <CategoriesList />
          <SettingsList />
        </section>
        <LobbyFooter lobbyPlayers={lobbyPlayers} gameState={gameState} />
      </div>
    </>
  )
}
export default Lobby
