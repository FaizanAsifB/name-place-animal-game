import { CiPlay1 } from 'react-icons/ci'
import { GiCancel } from 'react-icons/gi'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/ui/Button'

import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useOnSnapShot } from '../../hooks/useOnSnapShot'
import { updateGameState } from '../GameCreation/utils/http'
import CategoriesList from './components/CategoriesList'
import PlayerSlots from './components/PlayerSlots'
import SettingsList from './components/SettingsList'
import { inLobby, readyPlayers } from './utils/utils'

const Lobby = () => {
  const navigate = useNavigate()
  const params = useParams()
  const currentUser = useContext(AuthContext)

  const { data, error } = useOnSnapShot({
    docRef: 'lobbyPlayers',
    roomId: params.roomId!,
  })

  const isHost = data?.hostId === currentUser?.uid

  const ready = readyPlayers(data)
  const totalPlayers = inLobby(data)

  if (data?.gameState === 'game' && !isHost) navigate(`/game/${data!.lobbyId}`)

  function handlePlay() {
    updateGameState('game', params.roomId!)
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
