import UserInfo from '@/components/ui/UserInfo'
import { SCORES_STORAGE_KEY } from '@/config/gameConfig'
import { AuthContext } from '@/context/AuthContext'
import { getFromSessionStorage, saveToSessionStorage } from '@/utils/helpers'
import { updateGameState } from '@/utils/http'
import { useCallback, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

const useSessionStorage = (
  submittedUsers: string[] | undefined,
  currentRound: number | undefined,
  totalPlayers: number | undefined
) => {
  const params = useParams()
  const currentUser = useContext(AuthContext)

  const scoresStorageKey = SCORES_STORAGE_KEY(params.roomId!, currentRound)

  const goToResultsPage = useCallback(async () => {
    await updateGameState('RESULT', params.roomId)
  }, [params.roomId])

  useEffect(() => {
    const submittedInStorage =
      getFromSessionStorage<string[]>(scoresStorageKey) || []
    if (!submittedUsers) return
    if (submittedInStorage.length !== submittedUsers.length) {
      const [newSubmission] = submittedUsers.filter(
        user => !submittedInStorage.includes(user)
      )
      saveToSessionStorage(scoresStorageKey, [
        ...submittedInStorage,
        currentUser!.uid,
      ])

      toast(<UserInfo userId={newSubmission}>Submitted</UserInfo>)
    }
    if (submittedUsers.length === totalPlayers) goToResultsPage()
  }, [currentUser, scoresStorageKey, submittedUsers])
}

export default useSessionStorage
