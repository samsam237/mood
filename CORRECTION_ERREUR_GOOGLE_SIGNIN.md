# Correction de l'erreur Google Sign-In

## ❌ Erreur rencontrée
```
ERROR  Erreur de connexion Google: [TypeError: 0, _firebaseAuth.signInWithPopup is not a function (it is undefined)]
```

## 🔍 Cause du problème
L'erreur indique que `signInWithPopup` n'est pas disponible. Cette fonction est uniquement disponible pour le web, pas pour React Native mobile.

## ✅ Solution appliquée

### 1. Amélioration de la détection de plateforme
**Avant :**
```javascript
if (typeof window !== 'undefined') {
  // Code web
} else {
  // Code mobile
}
```

**Après :**
```javascript
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Code web - signInWithPopup
} else {
  // Code mobile - GoogleSignin
}
```

### 2. Code corrigé dans authService.js
```javascript
async signInWithGoogle() {
  try {
    console.log('Tentative de connexion Google...');
    console.log('Plateforme détectée:', Platform.OS);
    
    if (Platform.OS === 'web') {
      // Version web - utiliser signInWithPopup
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // ...
    } else {
      // Version mobile - utiliser GoogleSignin
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices();
      }
      
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
      const result = await signInWithCredential(auth, googleCredential);
      // ...
    }
  } catch (error) {
    console.error('Erreur de connexion Google:', error);
    return { 
      success: false, 
      error: this.getErrorMessage(error.code) || error.message
    };
  }
}
```

## 🧪 Test de la correction

### 1. Vérifier les logs
Après la correction, vous devriez voir dans les logs :
```
Tentative de connexion Google...
Plateforme détectée: android (ou ios)
Utilisation de GoogleSignin pour mobile
```

### 2. Tester l'authentification
1. Cliquez sur "Continuer avec Google"
2. Vérifiez que la popup Google s'ouvre
3. Sélectionnez un compte
4. Vérifiez la connexion

## ⚠️ Points importants

### 1. Build de développement requis
L'authentification Google native ne fonctionne **PAS** avec Expo Go. Vous devez utiliser un build de développement :

```bash
# Installer les dépendances
npm install @react-native-google-signin/google-signin

# Configurer EAS
eas build:configure

# Créer un build de développement
eas build --profile development --platform android
```

### 2. Configuration Google Cloud Console
Assurez-vous que :
- ✅ L'API Google Identity Platform est activée
- ✅ L'écran de consentement OAuth est configuré
- ✅ Les identifiants OAuth 2.0 sont créés
- ✅ Le SHA-1 fingerprint est ajouté
- ✅ Le package name correspond

### 3. Vérification des identifiants
Dans `src/config/googleSigninConfig.js` :
```javascript
GoogleSignin.configure({
  webClientId: '300243750008-oba368e0050b8h1e89e3la0crlrlase3.apps.googleusercontent.com',
  iosClientId: '300243750008-2tvafeivrod3t7qbblpuskefrrd70l5p.apps.googleusercontent.com',
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});
```

## 🔧 Dépannage supplémentaire

### Si l'erreur persiste :

1. **Vérifier l'installation :**
   ```bash
   npm list @react-native-google-signin/google-signin
   ```

2. **Nettoyer le cache :**
   ```bash
   npx expo start --clear
   ```

3. **Vérifier la configuration :**
   ```bash
   # Obtenir le SHA-1 correct
   expo fetch:android:hashes
   ```

4. **Tester avec un build de développement :**
   ```bash
   eas build --profile development --platform android
   ```

## 📱 Test sur différents environnements

### Web (Expo Web)
- Utilise `signInWithPopup`
- Fonctionne avec Expo Go

### Android (Build natif)
- Utilise `GoogleSignin.signIn()`
- Nécessite un build de développement
- Nécessite Google Play Services

### iOS (Build natif)
- Utilise `GoogleSignin.signIn()`
- Nécessite un build de développement
- Nécessite un compte Apple Developer

## ✅ Résultat attendu

Après la correction, l'authentification Google devrait fonctionner correctement sur mobile avec :
- ✅ Détection correcte de la plateforme
- ✅ Utilisation de la bonne méthode d'authentification
- ✅ Logs détaillés pour le débogage
- ✅ Gestion d'erreurs améliorée

## 📞 Support

Si le problème persiste :
1. Vérifiez les logs détaillés
2. Testez avec un build de développement
3. Vérifiez la configuration Google Cloud Console
4. Consultez la documentation officielle



