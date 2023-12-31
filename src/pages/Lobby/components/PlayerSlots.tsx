import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { useMutation } from '@tanstack/react-query'
import { DocumentData, FirestoreErrorCode } from 'firebase/firestore'
import { useCallback, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'

import { PlayerData } from '../../../lib/types'
// import { queryData } from '../../../utils/fetchData'
import { Toggle } from '@/components/ui/toggle'
import { Crown, ThumbsDown, ThumbsUp } from 'lucide-react'
import {
  addPlayerCount,
  createUserCategories,
  updatePlayers,
} from '../../GameCreation/utils/http'
import { inLobby } from '../utils/utils'

type PlayerSlotsProps = {
  data: DocumentData | undefined
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
    console.log(pressed)
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
        photoUrl: currentUser.photoURL,
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
    <ul className="col-span-3 space-y-4 rounded-lg row-span-full bg-amber-700/50">
      <h3 className="text-center">
        Players in Lobby {inLobby(data)}/{data?.slots.length}
      </h3>
      {data?.slots.map((slot: PlayerData) => {
        const { uid, displayName, isReady, isHost, slotNr, photoUrl } = slot
        return (
          <li
            key={slot.slotNr}
            className="flex items-center justify-start gap-2 px-4 py-1 border-2 rounded-3xl bg-amber-600"
          >
            <Avatar>
              <AvatarImage
                src={uid ? photoUrl : '/images/avatars/emptyAvatar.svg'}
              />
              <AvatarFallback>
                <img src="/images/avatars/emptyAvatar.svg" alt="empty slot" />
              </AvatarFallback>
            </Avatar>

            <span className="text-xl">{uid ? displayName : 'Empty Slot'}</span>
            {isHost && <Crown />}
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
          </li>
        )
      })}
    </ul>
  )
}
export default PlayerSlots
