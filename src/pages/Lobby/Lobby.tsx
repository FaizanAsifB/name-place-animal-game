import { CiPlay1 } from 'react-icons/ci'
import { GiCancel } from 'react-icons/gi'
import Button from '../../components/ui/Button'
import useNextPhase from '../../hooks/useNextPhase'
import { CreateGameData } from '../../lib/types'
import { fetchLobbyData } from '../../utils/fetchData'
import {
  createRoundsData,
  createScoresData,
  updateGameState,
} from '../GameCreation/utils/http'
import CategoriesList from './components/CategoriesList'
import PlayerSlots from './components/PlayerSlots'
import SettingsList from './components/SettingsList'
import { categoriesArr, getRoundsConfig, readyPlayers } from './utils/utils'

const Lobby = () => {
  const { params, data, fireStoreError } = useNextPhase()

  const ready = readyPlayers(data)
  const totalPlayers = data?.totalPlayers

  async function handlePlay() {
    const categoriesData = await fetchLobbyData(params.roomId!, 'categories')
    const settingsData = await fetchLobbyData(params.roomId!, 'lobbies')
    const customCategories = categoriesArr(categoriesData)
    const roundSelections = getRoundsConfig(
      customCategories!,
      settingsData?.settings.rounds
    )
    roundSelections.forEach((round, i) => {
      round.activeCategories =
        i === 0
          ? [...categoriesData!.default, ...round.categories]
          : !round.categories.toString()
          ? roundSelections[i - 1].activeCategories
          : [...roundSelections[i - 1].activeCategories!, ...round.categories]
    })

    const roundData: CreateGameData = {
      currentRound: 1,
      roundsConfig: roundSelections,
    }

    await createRoundsData(params.roomId!, roundData)

    data?.slots.map(async slot => {
      if (slot.displayName) await createScoresData(params.roomId!, slot.uid)
    })

    await updateGameState('INIT', params.roomId!)
  }

  return (
    <div className="p-4 space-y-8 rounded-lg bg-bg-dark">
      <h1>Lobby</h1>
      <div className="grid gap-y-4 md:gap-4 md:grid-cols-5 md:grid-rows-2">
        <PlayerSlots data={data} error={fireStoreError} />

        <CategoriesList />
        <SettingsList />
      </div>
      <div className="flex justify-around">
        <Button icon={<GiCancel />}>Cancel</Button>
        <Button
          disabled={ready !== totalPlayers || !data?.hostId}
          icon={<CiPlay1 />}
          onClick={handlePlay}
        >
          <span className="mr-2">
            {ready}/{totalPlayers}
          </span>
          <span>{ready !== totalPlayers ? 'Ready' : 'Play'}</span>
        </Button>
      </div>
    </div>
  )
}
export default Lobby
