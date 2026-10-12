import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';

// In demo mode there is no login; a fixed local user is used.
export const DEMO_USER = { uid: 'demo-user', email: 'demo@local', isDemo: true };

// Calls callback(user) now and whenever the login state changes.
// user is an object when logged in, or null when logged out. Returns an unsubscribe function.
export function watchAuth(callback) {
  if (!isFirebaseConfigured) {
    callback(DEMO_USER);
    return () => {};
  }
  return onAuthStateChanged(
    auth,
    (u) => callback(u ? { uid: u.uid, email: u.email, isDemo: false } : null),
    () => callback(null)
  );
}

export function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}
