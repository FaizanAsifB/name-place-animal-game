import { DocumentData, Timestamp } from 'firebase/firestore'
import { PlayerData } from '../../../lib/types'

type AddedCategories = {
  addedBy: string | undefined
  category1: {
    title: string
    addedAt: Timestamp
  }
  category2: {
    title: string
    addedAt: Timestamp
  }
}

// export const checkHost = (
//   data: DocumentData | undefined,
//   currentUser: string | undefined
// ): boolean | undefined => {
//   console.log(data, currentUser)
//   if (!data || !currentUser) return false
//   console.log('checkHost ran')

//   return data?.slots.filter((slot: PlayerData) => slot.uid === currentUser)[0]
//     .isHost
// }

export const inLobby = (data: DocumentData | undefined): number => {
  return data?.slots.reduce((acc: number, item: PlayerData) => {
    if (!item.uid) return acc
    if (item.uid) return acc + 1
  }, 0)
}

export const readyPlayers = (data: DocumentData | undefined): number => {
  return data?.slots.reduce((acc: number, item: PlayerData) => {
    if (!item.isReady) return acc
    if (item.isReady) return acc + 1
  }, 0)
}

export const getAllCategories = (data: DocumentData | undefined) => {
  if (!data) return
  const categories: Array<{ title: string; date: Timestamp }> = []
  Object.entries<AddedCategories>(data.custom).map(user => {
    if (user[1].category1.title)
      categories.push({
        title: user[1].category1.title,
        date: user[1].category1.addedAt,
      })
    if (user[1].category2.title)
      categories.push({
        title: user[1].category2.title,
        date: user[1].category2.addedAt,
      })
  })
  categories.sort((a, b) => a.date.toMillis() - b.date.toMillis())
  return categories
}

export const getCategoryCount = (data: DocumentData | undefined) => {
  let count = 0
  if (data?.category1.title) count += 1
  if (data?.category2?.title) count += 1
  return count
}
