// Import conditionnel pour éviter l'erreur en mode développement
let GoogleSignin = null;

try {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
} catch (error) {
  console.log('GoogleSignin non disponible:', error.message);
}

// Configuration Google Sign-In
export const configureGoogleSignIn = () => {
  if (GoogleSignin) {
    GoogleSignin.configure({
      // ID client Web (utilisé pour Android et iOS)
      webClientId: '829568384537-s85i6ko3ogs1jnmr9uc52tfb53vbcdnn.apps.googleusercontent.com',
      // ID client iOS (optionnel)
      iosClientId: '829568384537-3a5fvvrl8anfp3bddn3hucjv612s64r2.apps.googleusercontent.com',
      // androidClientId supprimé - n'est plus supporté dans les versions récentes
      offlineAccess: true,
      hostedDomain: '',
      forceCodeForRefreshToken: true,
      accountName: '',
    });
    console.log('Google Sign-In configuré avec succès - Projet personnel');
  } else {
    console.log('GoogleSignin non configuré - mode développement');
  }
};

export default configureGoogleSignIn;



