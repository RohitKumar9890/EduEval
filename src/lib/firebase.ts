import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'mock-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mock.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mock-id',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mock.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:000:web:000',
};

// Initialize Firebase (Gracefully handle empty config)
let app: any = null;
let auth: any = { 
  onAuthStateChanged: (cb: any) => () => {},
  signOut: async () => {} 
};
let db: any = {
  collection: () => ({ doc: () => ({ get: async () => ({ exists: () => false }) }) })
};
let storage: any = {};

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

if (!IS_MOCK) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('[Firebase-Client] Live Firebase initialized.');
  } catch (error) {
    console.warn('[Firebase-Client] Initialization failed. Falling back to Mock.');
  }
} else {
  console.log('[Firebase-Client] 🛠️  MOCK MODE ENABLED. Bypassing SDK init.');
}

export { auth, db, storage };
