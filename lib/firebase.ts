import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../config';

let app = null;
let dbInstance = null;

try {
  // Initialize Firebase only if config is present and valid
  if (FIREBASE_CONFIG.apiKey) {
    app = initializeApp(FIREBASE_CONFIG);
    dbInstance = getFirestore(app);
  }
} catch (error) {
  console.warn("Firebase initialization failed, falling back to local storage.", error);
  // App will continue with db = null, triggering fallback in api.ts
}

// Export Firestore instance
export const db = dbInstance;