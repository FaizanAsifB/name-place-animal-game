import { atom } from 'jotai'

export const displayImages = [
  { path: '/images/birdie.svg', title: 'birdie' },
  { path: '/images/deer.svg', title: 'deer' },
  { path: '/images/elephant.svg', title: 'elephant' },
  { path: '/images/giraffe.svg', title: 'giraffe' },
  { path: '/images/lion.svg', title: 'lion' },
  { path: '/images/monkey.svg', title: 'monkey' },
]

export const avatarAtom = atom(0)
