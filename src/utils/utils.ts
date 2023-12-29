import { atom } from 'jotai'

export const avatarImages = [
  { path: '/images/avatars/birdie.svg', title: 'birdie' },
  { path: '/images/avatars/deer.svg', title: 'deer' },
  { path: '/images/avatars/elephant.svg', title: 'elephant' },
  { path: '/images/avatars/giraffe.svg', title: 'giraffe' },
  { path: '/images/avatars/lion.svg', title: 'lion' },
  { path: '/images/avatars/monkey.svg', title: 'monkey' },
]

export const avatarAtom = atom(0)
