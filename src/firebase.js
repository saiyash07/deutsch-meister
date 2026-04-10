import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// REPLACE WITH YOUR ACTUAL CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_KEY",
  authDomain: "deutsch-meister.firebaseapp.com",
  projectId: "deutsch-meister",
  storageBucket: "deutsch-meister.appspot.com",
  messagingSenderId: "REPLACE_WITH_YOUR_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
