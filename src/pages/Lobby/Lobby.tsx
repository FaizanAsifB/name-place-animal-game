import { CiPlay1 } from 'react-icons/ci'
import { GiCancel } from 'react-icons/gi'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/ui/Button'

import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useOnSnapShot } from '../../hooks/useOnSnapShot'
import { fetchLobbyData } from '../../utils/fetchData'
import { createGameData, updateGameState } from '../GameCreation/utils/http'
import CategoriesList from './components/CategoriesList'
import PlayerSlots from './components/PlayerSlots'
import SettingsList from './components/SettingsList'
import {
  categoriesArr,
  getRoundsData,
  inLobby,
  readyPlayers,
} from './utils/utils'
import { GameData, GameState } from '../../lib/types'

const Lobby = () => {
  const navigate = useNavigate()
  const params = useParams()
  const currentUser = useContext(AuthContext)

  const [gameState, setGameState] = useState<GameState>('LOBBY')

  const { data, error } = useOnSnapShot({
    docRef: 'lobbyPlayers',
    roomId: params.roomId!,
  })

  const isHost = data?.hostId === currentUser?.uid

  const ready = readyPlayers(data)
  const totalPlayers = inLobby(data)

  useEffect(() => {
    if (data) setGameState(data.gameState)
    if (gameState === 'INIT' && !isHost) navigate(`/game/${data!.lobbyId}`)
  }, [data, gameState, isHost, navigate])

  async function handlePlay() {
    const categoriesData = await fetchLobbyData(params.roomId!, 'categories')
    const rounds = await fetchLobbyData(params.roomId!, 'lobbies')
    const customCategories = categoriesArr(categoriesData)
    const gameData: GameData = {
      categories: {
        default: categoriesData?.default,
        custom: customCategories,
      },
      gameState: 'INIT',
      currentRound: 1,
      rounds: getRoundsData(customCategories!, rounds?.settings.rounds),
    }
    console.log(gameData)
    await createGameData(params.roomId!, gameData)

    await updateGameState('game', params.roomId!)
    navigate(`/game/${data!.lobbyId}`)
  }

  return (
    <>
      <div className="p-4 space-y-4 bg-amber-800/30">
        <h1>Lobby</h1>

        <PlayerSlots data={data} error={error} />
        <CategoriesList />
        <SettingsList />
        <div className="flex justify-around">
          <Button icon={<GiCancel />}>Cancel</Button>
          <Button
            disabled={ready !== totalPlayers || !isHost}
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
    </>
  )
}
export default Lobby
