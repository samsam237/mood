import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { firebaseConfig, googleOAuthConfig, facebookConfig } from '../config/firebaseConfig';

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configurer les providers
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

class FirebaseAuthService {
  constructor() {
    this.auth = auth;
    this.googleProvider = googleProvider;
    this.facebookProvider = facebookProvider;
  }

  // Écouter les changements d'état d'authentification
  onAuthStateChanged(callback) {
    return onAuthStateChanged(this.auth, callback);
  }

  // Connexion avec Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      const user = result.user;
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photo: user.photoURL,
          provider: 'google'
        }
      };
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Connexion avec Facebook
  async signInWithFacebook() {
    try {
      const result = await signInWithPopup(this.auth, this.facebookProvider);
      const user = result.user;
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photo: user.photoURL,
          provider: 'facebook'
        }
      };
    } catch (error) {
      console.error('Facebook Sign-In Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Connexion avec email/mot de passe
  async signInWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      const user = result.user;
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email,
          photo: user.photoURL,
          provider: 'email'
        }
      };
    } catch (error) {
      console.error('Email Sign-In Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Inscription avec email/mot de passe
  async signUpWithEmail(email, password, displayName = null) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = result.user;
      
      // Mettre à jour le nom d'affichage si fourni
      if (displayName) {
        await user.updateProfile({ displayName });
      }
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          name: displayName || user.email,
          photo: user.photoURL,
          provider: 'email'
        }
      };
    } catch (error) {
      console.error('Email Sign-Up Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Déconnexion
  async signOut() {
    try {
      await firebaseSignOut(this.auth);
      return { success: true };
    } catch (error) {
      console.error('Sign Out Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!this.auth.currentUser;
  }
}

// Exporter une instance singleton
export const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;
