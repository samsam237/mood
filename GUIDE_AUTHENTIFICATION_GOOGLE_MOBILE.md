# Guide d'authentification Google pour React Native avec Expo

## ⚠️ Important : Limitations d'Expo Go

L'authentification Google native **ne fonctionne PAS** avec l'application Expo Go car elle nécessite du code natif. Vous devez utiliser un **build de développement personnalisé** (EAS Build) ou **Expo Dev Client**.

## Étape 1 : Configuration Google Cloud Console

### 1.1 Créer un projet Google Cloud
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API "Google Identity Platform"

### 1.2 Configurer l'écran de consentement OAuth
1. Allez dans "APIs & Services" > "Écran de consentement OAuth"
2. Remplissez les informations :
   - Nom de l'application : "MOOD"
   - Email de support : votre email
   - Domaines autorisés : ajoutez vos domaines

### 1.3 Créer les identifiants OAuth 2.0

#### Pour Android :
1. Allez dans "APIs & Services" > "Identifiants"
2. Cliquez "Créer des identifiants" > "ID client OAuth 2.0"
3. Sélectionnez "Application Android"
4. Remplissez :
   - Nom : "MOOD Android"
   - Nom du package : `com.yourcompany.moodtracker`
   - Empreinte SHA-1 : Obtenez-la avec `expo fetch:android:hashes`
5. Notez l'**ID client Android**

#### Pour iOS :
1. Créez un autre ID client OAuth 2.0
2. Sélectionnez "Application iOS"
3. Remplissez :
   - Nom : "MOOD iOS"
   - ID du bundle : `com.yourcompany.moodtracker`
4. Notez l'**ID client iOS**

#### Pour Web (déjà configuré) :
- Votre ID client web : `300243750008-oba368e0050b8h1e89e3la0crlrlase3.apps.googleusercontent.com`

## Étape 2 : Installation des dépendances

```bash
# Installer la bibliothèque Google Sign-In
npm install @react-native-google-signin/google-signin

# Installer EAS CLI pour les builds personnalisés
npm install -g @expo/eas-cli
```

## Étape 3 : Configuration Expo

### 3.1 Mettre à jour app.config.js
```javascript
export default {
  expo: {
    // ... votre configuration existante
    plugins: [
      [
        'expo-notifications',
        {
          icon: './assets/logomood.png',
          color: '#6366F1',
          sounds: ['./public/digital_alarm_clock_151920.wav'],
        }
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: "com.yourcompany.moodtracker"
        }
      ]
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yourcompany.moodtracker',
      googleServicesFile: './GoogleService-Info.plist' // Si vous utilisez Firebase
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/logomood.png',
        backgroundColor: '#6366F1'
      },
      package: 'com.yourcompany.moodtracker',
      googleServicesFile: './google-services.json', // Si vous utilisez Firebase
      permissions: [
        'android.permission.INTERNET',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE'
      ]
    }
  }
};
```

## Étape 4 : Créer un build de développement

### 4.1 Configurer EAS
```bash
# Se connecter à Expo
eas login

# Initialiser EAS dans votre projet
eas build:configure
```

### 4.2 Créer le build de développement
```bash
# Pour Android
eas build --profile development --platform android

# Pour iOS (nécessite un compte Apple Developer)
eas build --profile development --platform ios
```

## Étape 5 : Implémentation du code

### 5.1 Mettre à jour googleSigninConfig.js
```javascript
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '300243750008-oba368e0050b8h1e89e3la0crlrlase3.apps.googleusercontent.com',
    iosClientId: 'VOTRE_IOS_CLIENT_ID', // Remplacez par votre ID client iOS
    offlineAccess: true,
    hostedDomain: '',
    forceCodeForRefreshToken: true,
  });
};

export default configureGoogleSignIn;
```

### 5.2 Mettre à jour authService.js
```javascript
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { configureGoogleSignIn } from '../config/googleSigninConfig';

// Configurer Google Sign-In
configureGoogleSignIn();

export const authService = {
  // ... vos autres méthodes

  async signInWithGoogle() {
    try {
      console.log('Tentative de connexion Google...');
      
      // Vérifier si Google Play Services est disponible (Android)
      await GoogleSignin.hasPlayServices();
      
      // Effectuer la connexion
      const userInfo = await GoogleSignin.signIn();
      
      // Créer un credential Firebase
      const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
      
      // Se connecter à Firebase
      const result = await signInWithCredential(auth, googleCredential);
      
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

  async signOut() {
    try {
      // Déconnexion Firebase
      await signOut(auth);
      
      // Déconnexion Google
      await GoogleSignin.signOut();
      
      console.log('Déconnexion réussie');
      return { success: true };
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      return { success: false, error: error.message };
    }
  }
};
```

### 5.3 Mettre à jour AuthScreen.js
```javascript
// Dans la section des boutons sociaux, remplacez :
<TouchableOpacity
  style={[styles.googleButton, styles.disabledButton]}
  onPress={() => showError('Fonctionnalité limitée', 'L\'authentification Google n\'est disponible que sur le web. Utilisez la connexion email/mot de passe.')}
  activeOpacity={0.8}
>
  <MaterialIcons name="search" size={20} color="#999" />
  <Text style={[styles.googleButtonText, styles.disabledText]}>Google (Web uniquement)</Text>
</TouchableOpacity>

// Par :
<TouchableOpacity
  style={styles.googleButton}
  onPress={handleGoogleSignIn}
  disabled={loading.google}
  activeOpacity={0.8}
>
  <MaterialIcons name="search" size={20} color="#DB4437" />
  <Text style={styles.googleButtonText}>
    {loading.google ? 'Connexion...' : 'Continuer avec Google'}
  </Text>
</TouchableOpacity>
```

## Étape 6 : Test et déploiement

### 6.1 Tester avec le build de développement
1. Installez le build de développement sur votre appareil
2. Testez l'authentification Google
3. Vérifiez que les données utilisateur sont correctement récupérées

### 6.2 Créer un build de production
```bash
# Pour Android
eas build --profile production --platform android

# Pour iOS
eas build --profile production --platform ios
```

## Alternatives si vous voulez rester avec Expo Go

Si vous préférez rester avec Expo Go, vous pouvez utiliser :

### Option 1 : WebView avec Google OAuth
```javascript
import { WebView } from 'react-native-webview';

const GoogleAuthWebView = () => {
  const handleNavigationStateChange = (navState) => {
    if (navState.url.includes('success')) {
      // Traiter le succès de l'authentification
    }
  };

  return (
    <WebView
      source={{ uri: 'https://votre-domaine.com/google-auth' }}
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
};
```

### Option 2 : Expo AuthSession
```javascript
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const useGoogleAuth = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: 'VOTRE_WEB_CLIENT_ID',
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri(),
    },
    {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    }
  );

  return { request, response, promptAsync };
};
```

## Résumé des étapes

1. ✅ Configurer Google Cloud Console
2. ✅ Installer les dépendances
3. ✅ Mettre à jour la configuration Expo
4. ✅ Créer un build de développement
5. ✅ Implémenter le code d'authentification
6. ✅ Tester et déployer

## Support

- [Documentation Expo Google Auth](https://docs.expo.dev/guides/google-authentication/)
- [Documentation React Native Google Sign-In](https://github.com/react-native-google-signin/google-signin)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)



