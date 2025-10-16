# 🔧 Implémentation Google Sign-In Natif pour Mobile

## 📦 **Installation des Dépendances**

```bash
# Installer le plugin Google Sign-In natif
npm install @react-native-google-signin/google-signin

# Pour iOS - CocoaPods
cd ios && pod install && cd ..

# Pour Android - Configuration automatique
```

## ⚙️ **Configuration**

### **1. Configuration Android :**
- Aller sur [Google Cloud Console](https://console.cloud.google.com/)
- Créer un OAuth 2.0 Client ID pour Android
- Package name : `com.actipop.adroid`
- SHA-1 fingerprint (obtenir avec `keytool`)

### **2. Configuration iOS :**
- Créer un OAuth 2.0 Client ID pour iOS
- Bundle ID : `com.actipop.ios`

### **3. Configuration du Plugin :**
```javascript
// src/config/googleSigninConfig.js
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '300243750008-oba368e0050b8h1e89e3la0crlrlase3.apps.googleusercontent.com',
  iosClientId: '300243750008-2tvafeivrod3t7qbblpuskefrrd70l5p.apps.googleusercontent.com',
});
```

### **4. Service d'Authentification :**
```javascript
// src/services/authService.js
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

async signInWithGoogle() {
  try {
    // Vérifier si Google Play Services est disponible
    await GoogleSignin.hasPlayServices();
    
    // Obtenir les données utilisateur
    const userInfo = await GoogleSignin.signIn();
    
    // Créer les credentials Firebase
    const googleCredential = GoogleAuthProvider.credential(userInfo.data?.idToken);
    
    // Connexion Firebase
    const result = await signInWithCredential(auth, googleCredential);
    
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
    console.error('Erreur Google Sign-In:', error);
    return { 
      success: false, 
      error: this.getErrorMessage(error.code) 
    };
  }
}
```

## 🎯 **Avantages :**
- ✅ **Authentification native** - Plus rapide et sécurisée
- ✅ **Pas de popup** - Interface native
- ✅ **Meilleure UX** - Intégration système
- ✅ **Sécurité renforcée** - SDK officiel Google

---

## 📱 **Alternative - Facebook SDK Natif**

```bash
# Installer le plugin Facebook
npm install react-native-fbsdk-next
```

---

## 🔐 **Alternative - Téléphone avec reCAPTCHA Invisible**

```javascript
// Utiliser reCAPTCHA invisible pour mobile
const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  size: 'invisible', // Invisible au lieu de normal
  callback: (response) => {
    // reCAPTCHA résolu automatiquement
  }
});
```

---

## 🚀 **Implémentation Complète**

Voulez-vous que j'implémente une de ces solutions maintenant ?







