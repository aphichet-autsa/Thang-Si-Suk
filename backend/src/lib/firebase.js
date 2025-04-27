// src/libs/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ ต้อง import getAuth

console.log("Firebase API Key:", process.env.FIREBASE_API_KEY); // เปลี่ยนจาก import.meta.env เป็น process.env

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY, // ✅ แก้ชื่อให้ถูกต้อง
  authDomain: process.env.FIREBASE_AUTH_DOMAIN, // ✅ แก้ชื่อให้ถูกต้อง
  projectId: process.env.FIREBASE_PROJECT_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // ✅ ใช้งาน getAuth ได้ถูกต้อง
export default app;
