import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCKT-zbmcJC7pc7ioUj9qkf8IRVKdvFQFI",
  authDomain: "archives-1403.firebaseapp.com",
  projectId: "archives-1403",
  storageBucket: "archives-1403.appspot.com",
  messagingSenderId: "416102692933",
  appId: "1:416102692933:web:3e7d1bd97ca74d38474b2c"
};
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);


