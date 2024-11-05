
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import app from '../firebaseConfig';

const auth = getAuth(app);

export const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await signOut(auth);
};

// Google Authentication
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};

// Facebook Authentication
export const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  return await signInWithPopup(auth, provider);
};

// Phone Authentication
export const signInWithPhone = async (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};
