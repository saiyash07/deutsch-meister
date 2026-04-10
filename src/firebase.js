import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBz4JDRPR6pH9SCYapTacfA-g8P7vRxQZ",
  authDomain: "deutsch-meister-a2231.firebaseapp.com",
  projectId: "deutsch-meister-a2231",
  storageBucket: "deutsch-meister-a2231.firebasestorage.app",
  messagingSenderId: "391742603037",
  appId: "1:391742603037:web:0795148ee3b334228e6bf4",
  measurementId: "G-W1YG9JYGP4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
