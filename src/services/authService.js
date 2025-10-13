import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { authConfig } from '../config/authConfig';

export const authService = {
  // Connexion avec email et mot de passe
  async signInWithEmail(email, password) {
    try {
      console.log('Tentative de connexion avec email:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Connexion réussie:', result.user.email);
      return { 
        success: true, 
        user: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        }
      };
    } catch (error) {
      console.error('Erreur de connexion email:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  },

  // Inscription avec email et mot de passe
  async signUpWithEmail(email, password, displayName) {
    try {
      console.log('Tentative d\'inscription avec email:', email);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Mettre à jour le nom d'affichage
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      
      console.log('Inscription réussie:', result.user.email);
      return { 
        success: true, 
        user: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        }
      };
    } catch (error) {
      console.error('Erreur d\'inscription email:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  },

  // Connexion avec Google
  async signInWithGoogle() {
    try {
      console.log('Tentative de connexion Google...');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Connexion Google réussie:', result.user.email);
      return { 
        success: true, 
        user: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        }
      };
    } catch (error) {
      console.error('Erreur de connexion Google:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  },

  // Connexion avec Facebook
  async signInWithFacebook() {
    try {
      console.log('Tentative de connexion Facebook...');
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Connexion Facebook réussie:', result.user.email);
      return { 
        success: true, 
        user: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        }
      };
    } catch (error) {
      console.error('Erreur de connexion Facebook:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  },

  // Déconnexion
  async signOut() {
    try {
      await signOut(auth);
      console.log('Déconnexion réussie');
      return { success: true };
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      return { success: false, error: error.message };
    }
  },

  // Écouter les changements d'état d'authentification
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    return auth.currentUser;
  },

  // Messages d'erreur traduits
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'Aucun compte trouvé avec cet email',
      'auth/wrong-password': 'Mot de passe incorrect',
      'auth/email-already-in-use': 'Un compte existe déjà avec cet email',
      'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères',
      'auth/invalid-email': 'Adresse email invalide',
      'auth/user-disabled': 'Ce compte a été désactivé',
      'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard',
      'auth/operation-not-allowed': 'Cette méthode de connexion n\'est pas activée',
      'auth/popup-closed-by-user': 'Fenêtre de connexion fermée par l\'utilisateur',
      'auth/popup-blocked': 'La fenêtre de connexion a été bloquée',
      'auth/network-request-failed': 'Erreur de réseau',
    };
    return errorMessages[errorCode] || 'Une erreur est survenue';
  },

  // Méthodes utilitaires pour Facebook
  async getFacebookUserInfo(accessToken) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
      );
      const userInfo = await response.json();
      return {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        photo: userInfo.picture?.data?.url,
      };
    } catch (error) {
      console.error('Error fetching Facebook user info:', error);
      throw error;
    }
  },

  // Méthodes de développement - connexion rapide avec identifiants par défaut
  async signInWithDefault() {
    return await this.signInWithEmail(
      authConfig.defaultCredentials.email, 
      authConfig.defaultCredentials.password
    );
  }
};
