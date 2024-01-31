// firebase config key setup

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID } from '@env';

// Web app's firebase config
const firebaseConfig = {

  apiKey: process.env.FIREBASE_API_KEY,

  authDomain: process.env.FIREBASE_AUTH_DOMAIN,

  projectId: process.env.FIREBASE_PROJECT_ID,

  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,

  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,

  appId: process.env.FIREBASE_APP_ID

};

// initialisation
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };