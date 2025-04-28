// src/firebase.js

// Import functions ที่ต้องใช้จาก Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration ของโปรเจกต์คุณ
const firebaseConfig = {
  apiKey: "AIzaSyCcioU-ZElHNPjbFMIeLDr0UjHC-LRFxJY",
  authDomain: "project-scripting-e2427.firebaseapp.com",
  projectId: "project-scripting-e2427",
  storageBucket: "project-scripting-e2427.firebasestorage.app",
  messagingSenderId: "55288593922",
  appId: "1:55288593922:web:87bea2a526ce44bd65711b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth และ firestore db ออกไปใช้
export const auth = getAuth(app);
export const db = getFirestore(app);
