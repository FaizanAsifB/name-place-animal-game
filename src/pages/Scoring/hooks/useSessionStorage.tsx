import UserInfo from '@/components/ui/UserInfo'
import { SCORES_STORAGE_KEY } from '@/config/gameConfig'
import { AuthContext } from '@/context/AuthContext'
import { getFromSessionStorage, saveToSessionStorage } from '@/utils/helpers'
import { updateGameState } from '@/utils/http'
import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

const useSessionStorage = (
  submittedUsers: string[] | undefined,
  currentRound: number | undefined,
  totalPlayers: number | undefined
) => {
  const params = useParams()
  const currentUser = useContext(AuthContext)

  useEffect(() => {
    const goToResultsPage = async () =>
      await updateGameState('RESULT', params.roomId)

    if (!currentRound || !totalPlayers) return
    const scoresStorageKey = SCORES_STORAGE_KEY(params.roomId!, currentRound)
    const submittedInStorage =
      getFromSessionStorage<string[]>(scoresStorageKey) || []
    if (!submittedUsers) return
    if (submittedInStorage.length !== submittedUsers.length) {
      const newSubmission = submittedUsers.filter(
        user => !submittedInStorage.includes(user)
      )
      saveToSessionStorage(scoresStorageKey, [
        ...submittedInStorage,
        ...newSubmission,
      ])
      toast(
        <div className="flex items-center gap-2 font-semibold uppercase">
          <UserInfo userId={newSubmission.at(-1)!} />
          <span>Submitted</span>
        </div>,
        {
          position: 'top-right',
        }
      )
    }
    if (submittedUsers.length === totalPlayers) goToResultsPage()
  }, [currentUser, totalPlayers, currentRound, submittedUsers, params.roomId])
}

export default useSessionStorage
