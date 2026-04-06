import * as admin from 'firebase-admin';

let isInitialized = false;

if (!admin.apps.length && process.env.NEXT_PUBLIC_MOCK_MODE !== 'true') {
  try {
    if (!process.env.FIREBASE_PROJECT_ID) {
      throw new Error('FIREBASE_PROJECT_ID is NOT set');
    }
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
    console.log('[Firebase-Admin] Initialized Successfully');
    isInitialized = true;
  } catch (error: any) {
    console.warn('[Firebase-Admin] Initialization skipped or failed (Running in Mock/Demo Mode):', error.message);
  }
} else if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
  console.log('[Firebase-Admin] Bypass initialization (Mock Mode Active)');
  isInitialized = true;
} else {
  isInitialized = true;
}

let adminAuth: admin.auth.Auth | any;
let adminDb: admin.firestore.Firestore | any;

try {
  adminAuth = admin.auth();
  adminDb = admin.firestore();
} catch (e) {
  console.error('[Firebase-Admin] Failed to initialize default app:', (e as Error).message);
}

export { adminAuth, adminDb, admin, isInitialized };
