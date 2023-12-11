// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyALY0lTluZYv3MpceMwWXZYZ2xohHjIMjg',
  authDomain: 'name-place-animal-game.firebaseapp.com',
  projectId: 'name-place-animal-game',
  storageBucket: 'name-place-animal-game.appspot.com',
  messagingSenderId: '840869435386',
  appId: '1:840869435386:web:85b48d8fcdad15deebb643',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const db = getFirestore(app)
