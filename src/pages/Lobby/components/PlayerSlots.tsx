import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { useMutation } from '@tanstack/react-query'
import { FirestoreErrorCode } from 'firebase/firestore'
import { useCallback, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { PlayerData, PlayersData } from '../../../lib/types'
// import { queryData } from '../../../utils/fetchData'
import { H4 } from '@/components/typography/Headings'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import { Crown, ThumbsDown, ThumbsUp } from 'lucide-react'
import {
  addPlayerCount,
  createUserCategories,
  updatePlayers,
} from '../../GameCreation/utils/http'
import { inLobby } from '../utils/utils'
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

  const {
    mutate,
    /*  isPending,
    isError, */
    // error: updatingError,
  } = useMutation({
    mutationFn: updatePlayers,
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

  // if (isPending) {
  //   return <span>Loading...</span>
  // }

  // if (isError) {
  //   return <span>Error: {error.message}</span>
  // }
  // const photoUrl = async () => {
  //   if (!currentUser) return

  //   try {
  //     const res = await queryData('users', {
  //       property: 'uid',
  //       operator: '==',
  //       value: currentUser?.uid,
  //     })
  //     return res?.photoURL
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  return (
    <ul className="col-span-3 p-4 space-y-4 rounded-lg bg-primary-dark row-span-full">
      <H4 className="text-center">
        PLAYERS {inLobby(data)}/{data?.slots.length}
      </H4>
      {data?.slots.map((slot: PlayerData) => {
        const { uid, displayName, isReady, isHost, slotNr, photoUrl } = slot
        return (
          <li
            key={slot.slotNr}
            className={cn(
              'flex items-center justify-start gap-2 px-4 py-1   rounded-3xl',
              uid
                ? 'bg-neutral-100/80'
                : 'bg-orange-600 outline outline-2 outline-orange-500'
            )}
          >
            <Avatar>
              <AvatarImage
                src={uid ? photoUrl : '/images/avatars/emptyAvatar.svg'}
              />
              <AvatarFallback>
                <img src="/images/avatars/emptyAvatar.svg" alt="empty slot" />
              </AvatarFallback>
            </Avatar>

            <span>{uid ? displayName : 'Empty Slot'}</span>
            {currentUser?.uid === uid && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AddCategoriesButton currentUser={currentUser} />
                    {/* <Button variant={'icon'} size={'icon'}>
                      +
                    </Button> */}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add two categories of your choice</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {uid && (
              //added padding to center the icon
              <Toggle
                variant={'icon'}
                size={'icon'}
                defaultPressed={isReady}
                onPressedChange={pressed => handleReady(pressed, slotNr)}
                disabled={!(uid === currentUser?.uid)}
                className="pb-1"
              >
                {isReady ? (
                  <ThumbsUp color="green" />
                ) : (
                  <ThumbsDown color="red" />
                )}
              </Toggle>
            )}
            {isHost && <Crown />}
          </li>
        )
      })}
    </ul>
  )
}
export default PlayerSlots
