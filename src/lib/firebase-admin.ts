import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key must handle escaped newlines correctly for Vercel/Next.js
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
    console.log('[Firebase-Admin] Initialized Successfully');
  } catch (error: any) {
    console.error('[Firebase-Admin] Initialization Error:', error.message);
  }
}

let adminAuth: admin.auth.Auth | any;
let adminDb: admin.firestore.Firestore | any;

try {
  adminAuth = admin.auth();
  adminDb = admin.firestore();
} catch (e) {
  console.error('[Firebase-Admin] Failed to initialize default app:', (e as Error).message);
}

export { adminAuth, adminDb, admin };
