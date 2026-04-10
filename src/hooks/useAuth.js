import { useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  
  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
  
  const signupWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  
  const logout = () => signOut(auth);

  return { user, loading, loginWithGoogle, loginWithEmail, signupWithEmail, logout };
}
