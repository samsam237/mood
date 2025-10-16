// Import conditionnel pour éviter l'erreur en mode développement
let GoogleSignin = null;

try {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
} catch (error) {
  console.log('GoogleSignin non disponible en mode développement');
}

// Configuration Google Sign-In
export const configureGoogleSignIn = () => {
  if (GoogleSignin) {
    GoogleSignin.configure({
      webClientId: '300243750008-oba368e0050b8h1e89e3la0crlrlase3.apps.googleusercontent.com',
      iosClientId: '300243750008-2tvafeivrod3t7qbblpuskefrrd70l5p.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '',
      forceCodeForRefreshToken: true,
      accountName: '',
    });
  } else {
    console.log('GoogleSignin non configuré - mode développement');
  }
};

export default configureGoogleSignIn;



