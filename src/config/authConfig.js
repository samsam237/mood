// Configuration d'authentification
export const authConfig = {
  google: {
    webClientId: '300243750008-oba368e0050b8h1e89e3la0crlrlase3.apps.googleusercontent.com',
    iosClientId: '300243750008-oba368e0050b8h1e89e3la0crlrlase3.apps.googleusercontent.com',
  },
  facebook: {
    appId: 'YOUR_FACEBOOK_APP_ID', // À configurer si nécessaire
    clientToken: 'YOUR_FACEBOOK_CLIENT_TOKEN', // À configurer si nécessaire
  },
  // Identifiants par défaut pour le développement
  defaultCredentials: {
    email: 'demo@moodtracker.com',
    password: 'demo123',
    username: 'demo_user'
  }
};

// Instructions pour obtenir les identifiants :
// 
// GOOGLE SIGN-IN:
// 1. Aller sur https://console.cloud.google.com/
// 2. Créer un nouveau projet ou sélectionner un projet existant
// 3. Activer l'API Google+ API
// 4. Aller dans "Identifiants" > "Créer des identifiants" > "ID client OAuth 2.0"
// 5. Configurer l'écran de consentement OAuth
// 6. Créer un ID client pour "Application web" (webClientId)
// 7. Créer un ID client pour "iOS" (iosClientId)
//
// FACEBOOK LOGIN:
// 1. Aller sur https://developers.facebook.com/
// 2. Créer une nouvelle app
// 3. Ajouter le produit "Facebook Login"
// 4. Configurer les paramètres de plateforme pour iOS/Android
// 5. Récupérer l'App ID et le Client Token
