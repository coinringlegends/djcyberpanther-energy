import { initializeApp, getApps, getApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import type { FirebaseStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import appletConfig from '../firebase-applet-config.json';

// Support local overrides from Admin panel if user wants to switch projects, otherwise use appletConfig
const getLocalConfig = () => {
  try {
    const saved = localStorage.getItem('dj_cyberpanther_firebase_config');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Could not read custom firebase config from localStorage', e);
  }
  return null;
};

const customConfig = getLocalConfig();

export const firebaseConfig = {
  apiKey: customConfig?.apiKey || appletConfig.apiKey,
  authDomain: customConfig?.authDomain || appletConfig.authDomain,
  projectId: customConfig?.projectId || appletConfig.projectId,
  firestoreDatabaseId: customConfig?.firestoreDatabaseId || appletConfig.firestoreDatabaseId,
  storageBucket: customConfig?.storageBucket || appletConfig.storageBucket,
  messagingSenderId: customConfig?.messagingSenderId || appletConfig.messagingSenderId,
  appId: customConfig?.appId || appletConfig.appId
};

// Initialize Firebase instances
let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;
let auth: Auth;
let isFirebaseConnected = false;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  // CRITICAL: getFirestore must receive the custom firestoreDatabaseId if provided
  db = firebaseConfig.firestoreDatabaseId 
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

  storage = getStorage(app);
  auth = getAuth(app);
  isFirebaseConnected = true;
} catch (error) {
  console.warn("Firebase initialization warning:", error);
}

// Error handling conforming to the FirestoreErrorInfo standard
export const handleFirestoreError = (error: unknown, operationType: string, path: string | null) => {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
};

export { app, db, storage, auth, isFirebaseConnected };
export default firebaseConfig;
