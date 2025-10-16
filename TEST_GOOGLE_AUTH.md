# Test et Dépannage - Authentification Google

## ⚠️ Important : Limitations d'Expo Go

**L'authentification Google native ne fonctionne PAS avec Expo Go** car elle nécessite du code natif. Vous devez utiliser un **build de développement personnalisé**.

## Méthodes de test

### Option 1 : Build de développement (Recommandé)

#### 1.1 Installer les dépendances
```bash
# Exécuter le script de configuration
./setup-google-auth.sh

# Ou manuellement :
npm install @react-native-google-signin/google-signin
npm install -g @expo/eas-cli
```

#### 1.2 Configurer EAS
```bash
# Se connecter à Expo
eas login

# Configurer EAS Build
eas build:configure
```

#### 1.3 Créer un build de développement
```bash
# Pour Android
eas build --profile development --platform android

# Pour iOS (nécessite un compte Apple Developer)
eas build --profile development --platform ios
```

#### 1.4 Installer et tester
1. Téléchargez le build depuis le lien fourni par EAS
2. Installez-le sur votre appareil
3. Testez l'authentification Google

### Option 2 : Test avec Expo Dev Client

#### 2.1 Installer Expo Dev Client
```bash
# Sur Android
npx expo install expo-dev-client
npx expo run:android

# Sur iOS
npx expo install expo-dev-client
npx expo run:ios
```

#### 2.2 Tester l'authentification
1. Ouvrez l'application sur votre appareil
2. Allez à l'écran d'authentification
3. Cliquez sur "Continuer avec Google"
4. Vérifiez que la connexion fonctionne

## Dépannage

### Erreur : "Google Play Services not available"
**Solution :** Assurez-vous que Google Play Services est installé et à jour sur votre appareil Android.

### Erreur : "DEVELOPER_ERROR"
**Causes possibles :**
1. SHA-1 fingerprint incorrect
2. Package name incorrect
3. ID client OAuth incorrect

**Solutions :**
```bash
# Obtenir le SHA-1 correct
expo fetch:android:hashes

# Vérifier le package name dans app.config.js
# Vérifier les identifiants dans googleSigninConfig.js
```

### Erreur : "Sign in failed"
**Causes possibles :**
1. Configuration Google Cloud Console incomplète
2. Écran de consentement OAuth non configuré
3. API Google Identity non activée

**Solutions :**
1. Vérifiez la configuration dans Google Cloud Console
2. Assurez-vous que l'écran de consentement OAuth est configuré
3. Activez l'API Google Identity Platform

### Erreur : "Network error"
**Solutions :**
1. Vérifiez votre connexion internet
2. Testez sur un autre réseau
3. Vérifiez les paramètres de pare-feu

### Erreur : "Invalid client"
**Solutions :**
1. Vérifiez que l'ID client est correct
2. Assurez-vous que le package name correspond
3. Vérifiez que l'application est bien configurée dans Google Cloud Console

## Test de l'interface utilisateur

### Vérifications à effectuer :
1. ✅ Le bouton Google est visible et cliquable
2. ✅ Le bouton affiche "Continuer avec Google" (pas "Web uniquement")
3. ✅ Le bouton n'est pas grisé ou désactivé
4. ✅ Le loading fonctionne lors du clic
5. ✅ Les erreurs sont affichées correctement

### Test du flux complet :
1. Cliquer sur "Continuer avec Google"
2. Sélectionner un compte Google
3. Autoriser l'application
4. Vérifier la connexion dans l'app
5. Tester la déconnexion

## Logs de débogage

### Activer les logs détaillés :
```javascript
// Dans googleSigninConfig.js
GoogleSignin.configure({
  // ... votre configuration
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

// Dans authService.js, ajoutez plus de logs :
console.log('Google Sign-In configuré');
console.log('Tentative de connexion...');
console.log('Résultat:', userInfo);
```

### Vérifier les logs :
```bash
# Pour Android
npx react-native log-android

# Pour iOS
npx react-native log-ios
```

## Configuration de test

### Identifiants de test :
- **Web Client ID :** `300243750008-oba368e0050b8h1e89e3la0crlrlase3.apps.googleusercontent.com`
- **iOS Client ID :** `300243750008-2tvafeivrod3t7qbblpuskefrrd70l5p.apps.googleusercontent.com`
- **Package Name :** `com.yourcompany.moodtracker`

### Vérifications de configuration :
1. ✅ Google Cloud Console configuré
2. ✅ Identifiants OAuth créés
3. ✅ Écran de consentement configuré
4. ✅ API Google Identity activée
5. ✅ SHA-1 fingerprint ajouté
6. ✅ Package name correct

## Support

Si vous rencontrez des problèmes :

1. **Consultez les logs** pour identifier l'erreur exacte
2. **Vérifiez la configuration** Google Cloud Console
3. **Testez avec un build de développement** (pas Expo Go)
4. **Consultez la documentation** officielle :
   - [Expo Google Auth](https://docs.expo.dev/guides/google-authentication/)
   - [React Native Google Sign-In](https://github.com/react-native-google-signin/google-signin)

## Résumé des étapes de test

1. ✅ Installer les dépendances
2. ✅ Configurer EAS Build
3. ✅ Créer un build de développement
4. ✅ Installer sur l'appareil
5. ✅ Tester l'authentification
6. ✅ Vérifier les logs
7. ✅ Dépanner si nécessaire



