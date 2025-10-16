import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithCredential
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { authConfig } from '../config/authConfig';
import { Platform } from 'react-native';

// Import conditionnel pour GoogleSignin (évite l'erreur en mode développement)
let GoogleSignin = null;
let configureGoogleSignIn = null;

try {
  if (Platform.OS === 'web' || !__DEV__) {
    const googleSigninModule = require('@react-native-google-signin/google-signin');
    GoogleSignin = googleSigninModule.GoogleSignin;
    configureGoogleSignIn = require('../config/googleSigninConfig').configureGoogleSignIn;
  }
} catch (error) {
  console.log('GoogleSignin non disponible en mode développement:', error.message);
}

// Configurer Google Sign-In (seulement si disponible)
if (configureGoogleSignIn) {
  configureGoogleSignIn();
}

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
      console.log('Plateforme détectée:', Platform.OS);
      
      // Vérifier si GoogleSignin est disponible
      if (!GoogleSignin && Platform.OS !== 'web') {
        console.log('GoogleSignin non disponible - utilisation de la connexion par défaut');
        return await this.signInWithDefault();
      }
      
      // Vérifier si on est sur le web
      if (Platform.OS === 'web') {
        // Version web - utiliser signInWithPopup
        console.log('Utilisation de signInWithPopup pour le web');
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        console.log('Connexion Google réussie (web):', result.user.email);
        return { 
          success: true, 
          user: {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL
          }
        };
      } else {
        // Version mobile - utiliser GoogleSignin
        console.log('Utilisation de GoogleSignin pour mobile');
        
        // Vérifier si Google Play Services est disponible (Android)
        if (Platform.OS === 'android') {
          await GoogleSignin.hasPlayServices();
        }
        
        // Effectuer la connexion
        const userInfo = await GoogleSignin.signIn();
        console.log('GoogleSignin réussi, userInfo:', userInfo);
        
        // Créer un credential Firebase
        const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
        
        // Se connecter à Firebase
        const result = await signInWithCredential(auth, googleCredential);
        
        console.log('Connexion Google réussie (mobile):', result.user.email);
        return { 
          success: true, 
          user: {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL
          }
        };
      }
    } catch (error) {
      console.error('Erreur de connexion Google:', error);
      console.error('Code d\'erreur:', error.code);
      console.error('Message d\'erreur:', error.message);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) || error.message
      };
    }
  },

  // Connexion avec Facebook
  async signInWithFacebook() {
    try {
      console.log('Tentative de connexion Facebook...');
      
      // Pour la version mobile, utiliser la connexion par défaut
      if (Platform.OS !== 'web') {
        console.log('Version mobile - utilisation de la connexion par défaut');
        return await this.signInWithDefault();
      }
      
      // Version web - utiliser signInWithPopup
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Connexion Facebook réussie (web):', result.user.email);
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
      // Déconnexion Firebase
      await signOut(auth);
      
      // Déconnexion Google (mobile uniquement)
      if (Platform.OS !== 'web' && GoogleSignin) {
        try {
          await GoogleSignin.signOut();
          console.log('Déconnexion Google réussie');
        } catch (googleError) {
          console.log('Erreur déconnexion Google (non critique):', googleError);
        }
      }
      
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
      'auth/invalid-email': 'Adresse email invalide. Vérifiez le format (ex: nom@exemple.com)',
      'auth/user-disabled': 'Ce compte a été désactivé',
      'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard',
      'auth/operation-not-allowed': 'Cette méthode de connexion n\'est pas activée',
      'auth/popup-closed-by-user': 'Fenêtre de connexion fermée par l\'utilisateur',
      'auth/popup-blocked': 'La fenêtre de connexion a été bloquée',
      'auth/network-request-failed': 'Erreur de réseau',
      'auth/invalid-phone-number': 'Numéro de téléphone invalide',
      'auth/missing-phone-number': 'Numéro de téléphone requis',
      'auth/invalid-verification-code': 'Code de vérification invalide',
      'auth/invalid-verification-id': 'ID de vérification invalide',
      'auth/code-expired': 'Le code de vérification a expiré',
      'auth/session-expired': 'La session a expiré',
      'auth/missing-verification-code': 'Code de vérification requis',
      'auth/missing-verification-id': 'ID de vérification requis',
      'auth/quota-exceeded': 'Quota SMS dépassé',
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


  // Sauvegarde des données utilisateur
  async saveUserData(user) {
    try {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString()
      };
      
      // Stocker dans localStorage pour le web
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('drinkReminder', '20');
        localStorage.setItem('moveReminder', '20');
      }
      
      console.log('Données utilisateur sauvegardées');
      return { success: true };
    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
      return { success: false, error: error.message };
    }
  },

  // Nettoyage des données utilisateur
  async clearUserData() {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('drinkReminder');
        localStorage.removeItem('moveReminder');
      }
      console.log('Données utilisateur nettoyées');
      return { success: true };
    } catch (error) {
      console.error('Erreur de nettoyage:', error);
      return { success: false, error: error.message };
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
