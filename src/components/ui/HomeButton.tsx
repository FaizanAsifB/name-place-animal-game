import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { DEFAULT_SLOT } from '@/config/gameConfig'
import { AuthContext } from '@/context/AuthContext'
import { PlayerData, PlayersData } from '@/lib/types'
import { queryClient } from '@/utils/fetchData'
import {
  deleteLobby,
  removePlayerCategories,
  updateGameState,
  updatePlayers,
} from '@/utils/http'
import { useMutation } from '@tanstack/react-query'
import { Home } from 'lucide-react'
import { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from './button'

const HomeButton = ({ lobbyPlayers }: { lobbyPlayers: PlayersData }) => {
  const navigate = useNavigate()
  const params = useParams()
  const currentUser = useContext(AuthContext)

  const isHost = lobbyPlayers?.hostId === currentUser?.uid

  const { mutate } = useMutation({
    mutationFn: updatePlayers,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['lobbyPlayers', params.roomId],
      })
    },
  })

  function removePlayerFromLobby() {
    const currentPlayerIndex = lobbyPlayers.slots.findIndex(
      slot => slot.uid === currentUser?.uid
    )
    const updatedSlots: PlayerData[] = lobbyPlayers.slots.with(
      currentPlayerIndex,
      {
        ...DEFAULT_SLOT,
        slotNr: currentPlayerIndex,
      }
    )

    mutate({ roomId: params.roomId!, updatedSlots })
  }

  async function handleGoToHome() {
    if (!currentUser) return
    if (isHost) {
      navigate('/', { replace: true })
      await updateGameState('CANCELLED', params.roomId)
      await deleteLobby(params.roomId!)
    }
    if (!isHost) {
      await removePlayerCategories(params.roomId!, currentUser?.uid)
      removePlayerFromLobby()
      navigate('/', { replace: true })
    }
  }

  return (
    <>
      {
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="col-start-1 row-start-1 w-fit hover:bg-orange-700/40"
              variant={'outline'}
            >
              <Home className="size-6 md:size-5 lg:size-6" />
              <span className="hidden text-lg lg:text-xl md:inline-block">
                {' '}
                Home
              </span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                {isHost
                  ? 'Leaving the lobby as the host will cancel it for all players!'
                  : 'Are you sure you want to leave the lobby?'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleGoToHome}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }
    </>
  )
}
export default HomeButton
