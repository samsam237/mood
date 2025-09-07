
import { signInWithCredential, getAuth, signInWithEmailAndPassword, 
         createUserWithEmailAndPassword, signOut, GoogleAuthProvider, 
         signInWithPopup, FacebookAuthProvider, signInWithPhoneNumber, 
         RecaptchaVerifier, Auth } from 'firebase/auth';
import app from '../firebaseConfig';
import { storageService } from './storageService';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

import { FacebookLogin } from '@capacitor-community/facebook-login';

const auth = getAuth(app);

let recaptchaVerifier: RecaptchaVerifier;

/* export function setUpRecaptcha(containerId = 'recaptcha-container') {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(containerId, {
      size: 'invisible',
      callback: (response: any) => {
        console.log('reCAPTCHA resolved:', response);
      },
      'expired-callback': () => {
        console.warn('reCAPTCHA expired');
      },
    }, auth);
  }
}
 */
/* export async function sendPhoneCode(phoneNumber: string): Promise<any> {
  setUpRecaptcha(); // initialise invisible reCAPTCHA
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult; // Contient la méthode confirm(code)
  } catch (error) {
    console.error('Erreur envoi SMS', error);
    throw error;
  }
}
 */

export async function verifyPhoneCode(confirmationResult: any, code: string): Promise<any> {
  try {
    const result = await confirmationResult.confirm(code);
    return result.user;
  } catch (error) {
    console.error('Erreur vérification code:', error);
    throw error;
  }
}

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
  try {
    console.log('Début de la connexion Google...');
    const googleUser = await GoogleAuth.signIn();
    console.log('Google user reçu:', googleUser);
    
    if (!googleUser.authentication?.idToken) {
      throw new Error('Aucun token ID reçu de Google');
    }
    
    const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
    console.log('Credential créé:', credential);
    
    const result = await signInWithCredential(auth, credential);
    console.log('Connexion Firebase réussie:', result);
    return result;
  } catch (error) {
    console.error('Erreur Google Sign-In:', error);
    throw error;
  }
};

// Facebook Authentication
export const signInWithFacebook = async () => {
  try {
    console.log('Début de la connexion Facebook...');
    const FACEBOOK_PERMISSIONS = ['email', 'public_profile'];
    const result = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    console.log('Facebook login result:', result);
    
    if (result.accessToken) {
      const credential = FacebookAuthProvider.credential(result.accessToken.token);
      console.log('Facebook credential créé:', credential);
      
      const firebaseResult = await signInWithCredential(auth, credential);
      console.log('Connexion Firebase réussie:', firebaseResult);
      return firebaseResult;
    } else {
      throw new Error('Aucun jeton d\'accès Facebook reçu');
    }
  } catch (error) {
    console.error('Erreur Facebook Sign-In:', error);
    throw error;
  }
};

// Phone Authentication
/* export const signInWithPhone = async (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
}; */
export const signInWithPhone = async (phoneNumber: string, appVerifier: RecaptchaVerifier, auth: Auth) => {
  try {
    console.log('Début de la connexion par téléphone...', phoneNumber);
    const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    console.log('Code SMS envoyé avec succès');
    return result;
  } catch (error) {
    console.error('Erreur authentification téléphone:', error);
    throw error;
  }
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
  await storageService.set('user', userData);
  await storageService.set('drinkReminder', 20);
  await storageService.set('moveReminder', 20);
};

// Supprimer les informations utilisateur du stockage
const clearUserData = async () => {
  await storageService.remove('user');
};
