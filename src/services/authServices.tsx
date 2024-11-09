
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import app from '../firebaseConfig';
import storageService from './storageService';

const auth = getAuth(app);


export const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  await signOut(auth);
  await clearUserData();
  return true;
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

// Enregistrer les informations utilisateur dans le stockage
export const saveUserData = async (user: any) => {
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    phoneNumber: user.phoneNumber,
    photoURL: user.photoURL
  };
  const storage = await storageService.initializeStorage()
  await storage.set('user', userData);
};

// Supprimer les informations utilisateur du stockage
const clearUserData = async () => {
  const storage = await storageService.initializeStorage()
  await storage.remove('user');
};
