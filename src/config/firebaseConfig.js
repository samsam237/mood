// Configuration Firebase pour le web
// Basée sur le fichier google-services.json

export const firebaseConfig = {
  apiKey: "AIzaSyA1m3Vnt4U0zo0QwHrBENqwCfcjrDFQ2mg",
  authDomain: "actipop-authentication.firebaseapp.com",
  projectId: "actipop-authentication",
  storageBucket: "actipop-authentication.firebasestorage.app",
  messagingSenderId: "300243750008",
  appId: "1:300243750008:web:YOUR_WEB_APP_ID", // À remplacer par votre Web App ID
  measurementId: "G-YOUR_MEASUREMENT_ID" // Optionnel pour Analytics
};

// Configuration Google OAuth pour le web
export const googleOAuthConfig = {
  webClientId: "300243750008-oba368e0050b8h1e89e3la0crlrlase3.apps.googleusercontent.com",
  iosClientId: "300243750008-2tvafeivrod3t7qbblpuskefrrd70l5p.apps.googleusercontent.com"
};

// Configuration Facebook (à configurer dans Facebook Developers)
export const facebookConfig = {
  appId: "YOUR_FACEBOOK_APP_ID", // À configurer dans Facebook Developers
  version: "v18.0"
};

// Configuration d'authentification complète
export const authConfig = {
  firebase: firebaseConfig,
  google: googleOAuthConfig,
  facebook: facebookConfig
};
