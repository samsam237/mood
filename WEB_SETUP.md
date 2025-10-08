# Configuration Web - Mood Tracker App

## Problème résolu

L'erreur `RN GoogleSignin native module is not correctly linked` a été résolue en créant des versions web-compatibles des modules d'authentification.

## Fichiers créés/modifiés

### Nouveaux fichiers web-compatibles :
- `src/contexts/AuthContext.web.js` - Contexte d'authentification pour le web
- `src/screens/AuthScreen.web.js` - Écran de connexion pour le web
- `src/screens/HomeScreen.web.js` - Écran d'accueil pour le web
- `src/screens/ProfileScreen.web.js` - Écran de profil pour le web
- `src/screens/MoodEntryScreen.web.js` - Écran de saisie d'humeur pour le web
- `src/services/webStorage.js` - Service de stockage web-compatible

### Fichiers modifiés :
- `App.web.js` - Utilise maintenant les versions web des composants
- `src/config/authConfig.js` - Configuration des identifiants d'authentification

## Configuration requise

### 1. Google Sign-In

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet ou sélectionner un projet existant
3. Activer l'API Google+ API
4. Aller dans "Identifiants" > "Créer des identifiants" > "ID client OAuth 2.0"
5. Configurer l'écran de consentement OAuth
6. Créer un ID client pour "Application web" (webClientId)
7. Créer un ID client pour "iOS" (iosClientId)
8. Récupérer le client secret

### 2. Facebook Login

1. Aller sur [Facebook Developers](https://developers.facebook.com/)
2. Créer une nouvelle app
3. Ajouter le produit "Facebook Login"
4. Configurer les paramètres de plateforme pour iOS/Android
5. Récupérer l'App ID et le Client Token

### 3. Mise à jour de la configuration

Modifier le fichier `src/config/authConfig.js` avec vos vrais identifiants :

```javascript
export const authConfig = {
  google: {
    webClientId: 'votre-google-web-client-id',
    clientSecret: 'votre-google-client-secret',
    iosClientId: 'votre-google-ios-client-id',
  },
  facebook: {
    appId: 'votre-facebook-app-id',
    clientToken: 'votre-facebook-client-token',
  }
};
```

## Fonctionnalités web

### Authentification
- Google Sign-In avec Google Identity Services
- Facebook Login avec Facebook SDK
- Stockage local sécurisé avec localStorage

### Interface utilisateur
- Icônes simples remplaçant react-native-vector-icons
- Composants web-compatibles
- Dégradés web avec WebLinearGradient

### Stockage
- localStorage pour le stockage des données utilisateur
- Compatible avec l'API expo-secure-store

## Lancement de l'application

```bash
npm run web
```

L'application sera accessible sur `http://localhost:19006` (ou le port affiché dans le terminal).

## Notes importantes

1. **Sécurité** : Les identifiants d'authentification doivent être configurés correctement pour que l'authentification fonctionne.

2. **HTTPS** : Pour la production, l'application doit être servie en HTTPS pour que l'authentification Google et Facebook fonctionne correctement.

3. **Domaine autorisé** : Assurez-vous que votre domaine est autorisé dans les configurations Google et Facebook.

4. **Test** : L'application peut être testée en local, mais l'authentification nécessite des identifiants valides.

## Dépannage

Si vous rencontrez encore des erreurs :

1. Vérifiez que tous les identifiants sont correctement configurés
2. Assurez-vous que les domaines sont autorisés dans les consoles Google et Facebook
3. Vérifiez la console du navigateur pour d'autres erreurs
4. Redémarrez l'application après avoir modifié la configuration
