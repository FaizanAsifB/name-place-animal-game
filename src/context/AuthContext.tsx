import { onAuthStateChanged } from 'firebase/auth'
import firebase from 'firebase/compat/app'
import { createContext, useEffect, useState } from 'react'
import { auth } from '../config/config'

type AuthContextProviderProps = {
  children: React.ReactNode
}

export type FirebaseUser = firebase.UserInfo

export const AuthContext = createContext<FirebaseUser | null>(null)

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState<firebase.UserInfo | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setCurrentUser(user)
    })

    return () => {
      unsub()
    }
  }, [])

  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  )
}
