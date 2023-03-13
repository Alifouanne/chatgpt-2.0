import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: "chatgpt-clone-4f8d2.firebaseapp.com",
  projectId: "chatgpt-clone-4f8d2",
  storageBucket: "chatgpt-clone-4f8d2.appspot.com",
  messagingSenderId: "983739501517",
  appId: "1:983739501517:web:a6e2facc364ab53e7bd284",
}; // Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
