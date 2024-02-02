import DotsLoader from '@/components/ui/DotsLoader'
import { Button } from '@/components/ui/button'
import { BTN_ICON_SIZE } from '@/config/gameConfig'
import { GameState, PlayersData } from '@/lib/types'
import { createRoundsData, updateGameState } from '@/utils/http'
import { useMutation } from '@tanstack/react-query'
import { Gamepad2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { calcReadyPlayers, roundsDataForPlay } from '../utils/utils'
import InviteDropDown from './InviteDropDown'

type LobbyFooterProps = {
  lobbyPlayers: PlayersData | undefined
  gameState: GameState | undefined
  isHost: boolean
}

const LobbyFooter = ({ lobbyPlayers, gameState, isHost }: LobbyFooterProps) => {
  const params = useParams()

  const { mutate } = useMutation({
    mutationFn: createRoundsData,
    onSuccess: async () => {
      await updateGameState('INIT', params.roomId!)
    },
  })

  const readyPlayers = calcReadyPlayers(lobbyPlayers)
  const totalPlayers = gameState?.totalPlayers
  const allPlayersReady = readyPlayers === totalPlayers

  async function handlePlay() {
    if (!lobbyPlayers) return

    const roundData = await roundsDataForPlay(
      params.roomId!,
      lobbyPlayers.slots
    )

    mutate({ lobbyId: params.roomId!, data: roundData })

    return
  }

  return (
    <>
      {isHost && (
        <footer className="flex justify-around">
          <InviteDropDown roomId={params?.roomId} />
          <Button disabled={!allPlayersReady || !isHost} onClick={handlePlay}>
            {allPlayersReady ? (
              <>
                <Gamepad2 size={BTN_ICON_SIZE} />
                <span>Play</span>
              </>
            ) : (
              `${readyPlayers}/${totalPlayers} Ready`
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
    </>
  )
}
export default LobbyFooter
