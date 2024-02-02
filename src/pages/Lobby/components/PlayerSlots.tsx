import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { useMutation } from '@tanstack/react-query'
import { FirestoreErrorCode } from 'firebase/firestore'
import { useCallback, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'

import { PlayerData, PlayersData } from '../../../lib/types'
// import { queryData } from '../../../utils/fetchData'
import { H4, H6 } from '@/components/typography/Headings'
import { Toggle } from '@/components/ui/toggle'
import { categoriesAtom } from '@/context/atoms'
import { cn } from '@/lib/utils'
import { queryClient } from '@/utils/fetchData'
import { useAtomValue } from 'jotai'
import { Crown, ThumbsDown, ThumbsUp } from 'lucide-react'
import {
  addPlayerCount,
  createUserCategories,
  updatePlayers,
} from '../../../utils/http'
import { getCategoryCount, inLobby } from '../utils/utils'
import AddCategoriesButton from './AddCategoriesButton'

type PlayerSlotsProps = {
  data: PlayersData | undefined
  error:
    | {
        code: FirestoreErrorCode
        message: string
      }
    | undefined
}

const PlayerSlots = ({ data /* error */ }: PlayerSlotsProps) => {
  const params = useParams()
  const currentUser = useContext(AuthContext)
  const categoriesData = useAtomValue(categoriesAtom)

  const {
    mutate,
    /*  isPending,
    isError, */
    // error: updatingError,
  } = useMutation({
    mutationFn: updatePlayers,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lobbyPlayers', params.roomId],
      })
    },
  })

  function handleReady(pressed: boolean, i: number) {
    const updatedData = data?.slots.with(i, {
      ...data.slots[i],
      isReady: pressed,
    })
    mutate({ roomId: params.roomId!, updatedData })
  }

  const addToLobby = useCallback(() => {
    if (!params.roomId || !currentUser || !data) return

    const currIndex = data?.slots.findIndex(
      (slot: PlayerData) => slot.uid === currentUser?.uid
    )

    if (currIndex >= 0) return

    if (currIndex === -1) {
      const i: number = data.slots.findIndex(
        (slot: PlayerData) => slot.uid === ''
      )
      const updatedData: PlayerData[] = data.slots.with(i, {
        ...data.slots[i],
        displayName: currentUser.displayName,
        uid: currentUser.uid,
        photoUrl: currentUser.photoURL!,
      })
      mutate({ roomId: params.roomId, updatedData })
      addPlayerCount(params.roomId)
      createUserCategories(params.roomId, currentUser.uid)
    }
  }, [currentUser, data, mutate, params.roomId])

  useEffect(() => {
    addToLobby()
  }, [addToLobby])

  return (
    <section className="p-4 rounded-lg md:col-span-3 bg-primary-dark md:row-span-full ">
      <H4 className="mb-4 text-center">
        PLAYERS {inLobby(data)}/{data?.slots.length}
      </H4>
      <ul className="space-y-4">
        {data?.slots.map((slot: PlayerData) => {
          const { uid, displayName, isReady, isHost, slotNr, photoUrl } = slot
          const isCurrentPlayer = uid === currentUser?.uid
          const categoryCount = getCategoryCount(categoriesData?.custom?.[uid])

          return (
            <li
              key={slot.slotNr}
              className={cn(
                'grid grid-cols-[auto,1fr,auto,auto] items-center justify-start gap-2 px-4 py-1 rounded-3xl md:gap-3',
                uid
                  ? 'bg-neutral-100/80'
                  : 'bg-orange-600 outline outline-2 outline-orange-500'
              )}
            >
              <Avatar className="md:w-14 md:h-14">
                <AvatarImage
                  src={uid ? photoUrl : '/images/avatars/emptyAvatar.svg'}
                />
                <AvatarFallback>
                  <img src="/images/avatars/emptyAvatar.svg" alt="empty slot" />
                </AvatarFallback>
              </Avatar>

              <H6 className="flex gap-2 uppercase">
                {uid ? displayName : 'Empty Slot'} {isHost && <Crown />}
              </H6>
              {isCurrentPlayer && (
                <AddCategoriesButton currentUser={currentUser} />
              )}
              {!isCurrentPlayer && uid && (
                <>
                  {/* <span className="hidden lg:inline-block">
                    Added Categories
                  </span> */}
                  <span className="px-2 md:text-lg lg:text-2xl">
                    {categoryCount}/2
                  </span>
                </>
              )}
              {uid && (
                //added padding to center the icon
                <Toggle
                  variant={'icon'}
                  size={'icon'}
                  defaultPressed={isReady}
                  onPressedChange={pressed => handleReady(pressed, slotNr)}
                  disabled={!isCurrentPlayer}
                  className={isReady ? 'pb-1' : 'pt-1'}
                >
                  {isReady ? (
                    <ThumbsUp color="green" />
                  ) : (
                    <ThumbsDown color="red" />
                  )}
                </Toggle>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
export default PlayerSlots
