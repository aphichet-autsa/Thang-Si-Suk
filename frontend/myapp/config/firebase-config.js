// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
<<<<<<< HEAD
import { getFirestore } from "firebase/firestore";
=======

>>>>>>> 391aa03ffc919290c079b900db9c79bd65e7363b


export const firebaseConfig = {
  apiKey: "AIzaSyCcioU-ZElHNPjbFMIeLDr0UjHC-LRFxJY",
  authDomain: "project-scripting-e2427.firebaseapp.com",
  projectId: "project-scripting-e2427",
  storageBucket: "project-scripting-e2427.firebasestorage.app",
  messagingSenderId: "55288593922",
  appId: "1:55288593922:web:87bea2a526ce44bd65711b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
<<<<<<< HEAD
const db = getFirestore(app);

export { auth, db };
=======

export { auth };
>>>>>>> 391aa03ffc919290c079b900db9c79bd65e7363b
