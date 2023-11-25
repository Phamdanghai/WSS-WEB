import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyD-3sIU1ddfA_-lydnJKsRBpamFFOfOrTg',
  authDomain: 'wedding-service-wss.firebaseapp.com',
  databaseURL: 'https://wedding-service-wss-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'wedding-service-wss',
  storageBucket: 'wedding-service-wss.appspot.com',
  messagingSenderId: '716165936197',
  appId: '1:716165936197:web:e40a8a74cbcb8c72521f2c',
  measurementId: 'G-40XM8B81K2'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
