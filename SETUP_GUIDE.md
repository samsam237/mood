# Guide de Configuration - Mood Tracker App

## 🚀 Démarrage Rapide

### 1. Installation des dépendances
```bash
# Installation complète
npm install --legacy-peer-deps

# Ou utiliser le script automatique
install-deps.bat
```

### 2. Démarrage de l'application

#### Option A : Script automatique (Recommandé)
```bash
# Windows - Script optimisé pour le web
start-web.bat

# Ou script complet
start-app.bat
```

#### Option B : Démarrage manuel
```bash
# Pour le web (avec cache vidé)
npx expo start --web --clear

# Pour Android
npx expo start --android

# Pour iOS
npx expo start --ios
```

## ⚠️ Problèmes connus et solutions

### Erreur Facebook AppID
**Problème** : `Error: missing appID in the plugin properties`

**Solution** : Le plugin Facebook est temporairement désactivé dans `app.config.js`. Pour l'activer :

1. Créer une app Facebook sur https://developers.facebook.com/
2. Récupérer l'App ID et Client Token
3. Décommenter et configurer dans `app.config.js` :

```javascript
plugins: [
  '@react-native-google-signin/google-signin',
  [
    'react-native-fbsdk-next',
    {
      appID: 'VOTRE_FACEBOOK_APP_ID',
      clientToken: 'VOTRE_FACEBOOK_CLIENT_TOKEN',
      displayName: 'Mood Tracker'
    }
  ]
]
```

### Configuration Google Sign-In

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet
3. Activer l'API Google+ API
4. Créer des identifiants OAuth 2.0
5. Mettre à jour `src/contexts/AuthContext.js` :

```javascript
GoogleSignin.configure({
  webClientId: 'VOTRE_WEB_CLIENT_ID',
  iosClientId: 'VOTRE_IOS_CLIENT_ID',
  offlineAccess: true,
});
```

### Conflits de dépendances React

**Problème** : Conflits entre React 18.2.0 et 18.3.1

**Solution** : Utiliser `--legacy-peer-deps` pour l'installation :

```bash
npm install --legacy-peer-deps
```

### Dépendances manquantes

**Problème** : `Unable to resolve "react-native-blob-util"`, `react-native-svg`, etc.

**Solution** : Utiliser le script d'installation automatique :

```bash
# Script automatique (recommandé)
install-deps.bat

# Ou installation manuelle complète
npm install expo-status-bar react-native-blob-util react-native-svg react-native-web@~0.19.6 @expo/metro-runtime@~3.1.3 react-native-chart-kit --legacy-peer-deps
```

### Liste complète des dépendances requises

- `expo-status-bar` - Barre de statut Expo
- `react-native-blob-util` - Utilitaires pour les fichiers (PDF)
- `react-native-svg` - Support SVG (graphiques)
- `react-native-web` - Support web
- `@expo/metro-runtime` - Runtime Metro
- `react-native-chart-kit` - Bibliothèque de graphiques
- `expo-linear-gradient` - Dégradés (composant web inclus)
- `react-native-vector-icons` - Icônes (composant web inclus)

### Composants Web-Compatibles

L'application inclut des versions web-compatibles des composants natifs :

- `WebLinearGradient` - Remplacement de `expo-linear-gradient` pour le web
- `WebPDFViewer` - Lecteur PDF utilisant iframe pour le web
- `AuthScreen.web.js` - Écran d'authentification optimisé pour le web
- `HomeScreen.web.js` - Écran d'accueil simplifié pour le web
- `PDFViewerScreen.web.js` - Écran de visualisation PDF pour le web

Ces composants sont automatiquement sélectionnés via `src/utils/platform.js`.

## 🧪 Test de l'application

### Mode Web
1. Lancer `npx expo start --web`
2. Ouvrir http://localhost:8081
3. Tester l'interface (sans authentification pour l'instant)

### Mode Mobile
1. Installer l'app Expo Go sur votre téléphone
2. Scanner le QR code affiché
3. Tester sur l'appareil

## 📱 Fonctionnalités testables

### ✅ Fonctionnelles
- Interface utilisateur complète
- Navigation par onglets
- Système de thème
- Composants réutilisables
- Structure de données

### ⚠️ Nécessitent configuration
- Authentification Google (besoin des identifiants)
- Authentification Facebook (plugin désactivé)
- Lecteur PDF (besoin d'URLs valides)

## 🔧 Configuration avancée

### Variables d'environnement
Créer un fichier `.env` :
```
GOOGLE_WEB_CLIENT_ID=votre_google_web_client_id
GOOGLE_IOS_CLIENT_ID=votre_google_ios_client_id
FACEBOOK_APP_ID=votre_facebook_app_id
FACEBOOK_CLIENT_TOKEN=votre_facebook_client_token
```

### Assets personnalisés
Remplacer les fichiers dans `assets/` :
- `icon.png` - Icône de l'app (1024x1024px)
- `splash.png` - Écran de démarrage (1242x2436px)
- `logo.png` - Logo de l'app (120x120px)
- `default-avatar.png` - Avatar par défaut (80x80px)

## 🐛 Dépannage

### L'application ne démarre pas
1. Vérifier que toutes les dépendances sont installées
2. Utiliser `npx expo start --clear` pour vider le cache
3. Redémarrer le serveur de développement

### Erreurs de navigation
1. Vérifier que React Navigation est correctement installé
2. Redémarrer l'application

### Problèmes d'authentification
1. Vérifier la configuration des identifiants
2. S'assurer que les URLs de redirection sont correctes
3. Tester d'abord sans authentification

## 📞 Support

Pour toute question ou problème :
1. Vérifier ce guide
2. Consulter les logs d'erreur
3. Ouvrir une issue sur GitHub

---

**Mood Tracker v1.0.0** - Configuration terminée ✅
