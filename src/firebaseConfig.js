import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'


const firebaseConfig = {
    apiKey: "AIzaSyC2Mk7FPdUODz04as-0Jn7vJUXzXSYu_pU",
    authDomain: "socialnetwork-a235d.firebaseapp.com",
    projectId: "socialnetwork-a235d",
    storageBucket: "socialnetwork-a235d.appspot.com",
    messagingSenderId: "109813984664",
    appId: "1:109813984664:web:153821542d15b4c6310fed"
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)