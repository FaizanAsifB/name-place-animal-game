import { User, onAuthStateChanged } from 'firebase/auth'
import { useSetAtom } from 'jotai'
import { createContext, useEffect, useState } from 'react'
import { auth } from '../config/config'
import { displayNameAtom } from './atoms'

type AuthContextProviderProps = {
  children: React.ReactNode
}

export const AuthContext = createContext<User | null>(null)

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const setDisplayName = useSetAtom(displayNameAtom)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setCurrentUser(user)
      setDisplayName(user?.displayName)
    })

    return () => {
      unsub()
    }
  }, [setDisplayName])

  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  )
}
