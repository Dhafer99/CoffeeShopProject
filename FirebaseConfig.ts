// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbyc2GwJKBApVaCl_vJ5899_ea0U2ZBKE",
  authDomain: "coffeshopproject-9ec8f.firebaseapp.com",
  projectId: "coffeshopproject-9ec8f",
  storageBucket: "coffeshopproject-9ec8f.appspot.com",
  messagingSenderId: "909463892082",
  appId: "1:909463892082:web:d5e3afc0125253f30f52eb",
  measurementId: "G-897NRL5GD5"
};

// Initialize Firebase
export const  FIREBASE_APP = initializeApp(firebaseConfig);
export const  FIREBASE_AUTH = getAuth(FIREBASE_APP);

export const FIRESTORE_DB = getFirestore(FIREBASE_APP);

const analytics = getAnalytics(FIREBASE_APP);