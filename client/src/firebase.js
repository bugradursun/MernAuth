/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-c460e.firebaseapp.com",
  projectId: "mern-auth-c460e",
  storageBucket: "mern-auth-c460e.appspot.com",
  messagingSenderId: "414043435052",
  appId: "1:414043435052:web:69e0555ee955c6b4bee189",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
