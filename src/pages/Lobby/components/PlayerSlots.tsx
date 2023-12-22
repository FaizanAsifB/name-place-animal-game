import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import Checkbox from '@mui/material/Checkbox'
import { useMutation } from '@tanstack/react-query'
import { DocumentData, FirestoreErrorCode } from 'firebase/firestore'
import { ChangeEvent, useCallback, useContext, useEffect } from 'react'
import { TfiCrown } from 'react-icons/tfi'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'

import { PlayerData } from '../../../lib/types'
// import { queryData } from '../../../utils/fetchData'
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

  function handleReady(e: ChangeEvent<HTMLInputElement>, i: number) {
    const updatedData = data?.slots.with(i, {
      ...data.slots[i],
      isReady: e.target.checked,
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
    <>
      <h3 className="text-center">
        Players in Lobby {inLobby(data)}/{data?.slots.length}
      </h3>
      <ul className="p-2 space-y-4 bg-amber-700/50">
        {data?.slots.map((slot: PlayerData) => {
          const { uid, displayName, isReady, isHost, slotNr } = slot
          return (
            <li
              key={slot.slotNr}
              className="flex items-center justify-start gap-2 px-4 py-1 border-2 rounded-3xl bg-amber-600"
            >
              <img
                src={uid ? slot.photoUrl : '/images/empty.svg'}
                alt=""
                className="w-10"
              />
              <span className="text-xl">
                {uid ? displayName : 'Empty Slot'}
              </span>
              {isHost && <TfiCrown w="24" h="24" />}
              {uid && (
                <Checkbox
                  checked={isReady}
                  onChange={e => handleReady(e, slotNr)}
                  disabled={!(uid === currentUser?.uid)}
                  sx={{ ml: 'auto' }}
                  icon={<ClearOutlinedIcon color="error" />}
                  checkedIcon={<CheckOutlinedIcon color="success" />}
                />
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}
export default PlayerSlots
