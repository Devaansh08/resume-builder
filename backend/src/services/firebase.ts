import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let firebaseApp: admin.app.App;

export function getFirebaseAdmin(): admin.app.App {
  if (!firebaseApp) {
    const projectId = process.env.FIREBASE_PROJECT_ID || 'resumeai-builder-59813';
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const hasValidKey = privateKey && !privateKey.includes('YOUR_PRIVATE_KEY') && privateKey.includes('BEGIN PRIVATE KEY');

    if (!hasValidKey) {
      console.warn('[Firebase Admin] No valid service account private key found — initializing with projectId only for ID token verification');
      firebaseApp = admin.initializeApp({
        projectId,
      });
    } else {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    }

    console.log('[Firebase Admin] Initialized with projectId:', projectId);
  }
  return firebaseApp;
}

export async function verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  const app = getFirebaseAdmin();
  return app.auth().verifyIdToken(idToken);
}

export function getFirestore(): admin.firestore.Firestore {
  const app = getFirebaseAdmin();
  return app.firestore();
}
