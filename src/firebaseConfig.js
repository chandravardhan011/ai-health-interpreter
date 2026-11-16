// Firebase configuration for AI Health Interpreter
// Environment variables should be defined in a .env file at the project root.
// Example: VITE_FIREBASE_API_KEY=your_api_key

import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Enable offline persistence (IndexedDB) for Firestore
enableIndexedDbPersistence(db).catch((err) => {
  console.warn("Firestore persistence could not be enabled:", err.message);
});

// Optional: anonymous authentication so Firestore rules can rely on auth.uid
const auth = getAuth(app);
signInAnonymously(auth).catch((error) => {
  console.warn("Anonymous sign‑in failed:", error);
});

export { auth };