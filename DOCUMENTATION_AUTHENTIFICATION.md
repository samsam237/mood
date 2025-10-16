# Documentation Technique - Système d'Authentification

## Vue d'ensemble

Ce projet utilise Firebase Authentication avec une application Ionic React/Capacitor pour implémenter plusieurs méthodes d'authentification. Le système supporte l'authentification par email/mot de passe, Google, Facebook et téléphone.

## Architecture du Système

### 1. Configuration Firebase

#### Configuration Web (`src/firebaseConfig.ts`)
```typescript
const firebaseConfig = {
    apiKey: "AIzaSyDo33bVvWxnSl0jR9pUsWpx5cH5PgT4UdQ",
    authDomain: "actipop-authentication.firebaseapp.com",
    projectId: "actipop-authentication",
    storageBucket: "actipop-authentication.firebasestorage.app",
    messagingSenderId: "300243750008",
    appId: "1:300243750008:web:9fccc0653d155df34af18d",
    measurementId: "G-XN8S0TDRB7"
};
```

#### Configuration Android (`android/app/google-services.json`)
- **Project ID**: `actipop-authentication`
- **Project Number**: `300243750008`
- **Package Names**: 
  - `com.actipop.adroid` (principal)
  - `io.ionic.starter` (développement)
- **Client ID Google**: `300243750008-oba368e0050b8h1e89e3la0crlrlase3.apps.googleusercontent.com`

### 2. Services d'Authentification

#### Fichier Principal: `src/services/authServices.tsx`

Le service centralise toutes les méthodes d'authentification :

##### Authentification Email/Mot de passe
```typescript
export const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};
```

##### Authentification Google
```typescript
export const signInWithGoogle = async () => {
  const googleUser = await GoogleAuth.signIn();
  const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
  return await signInWithCredential(auth, credential);
};
```

##### Authentification Facebook
```typescript
export const signInWithFacebook = async () => {
  const FACEBOOK_PERMISSIONS = ['email', 'public_profile'];
  const result = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
  const credential = FacebookAuthProvider.credential(result.accessToken.token);
  return await signInWithCredential(auth, credential);
};
```

##### Authentification par Téléphone
```typescript
export const signInWithPhone = async (phoneNumber: string, appVerifier: RecaptchaVerifier, auth: Auth) => {
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

export const verifyPhoneCode = async (confirmationResult: any, code: string) => {
  return await confirmationResult.confirm(code);
};
```

### 3. Composants d'Interface Utilisateur

#### Structure des Composants
```
src/components/authentication/
├── EmailPasswordAuth.tsx    # Email/Mot de passe
├── EmailPasswordAuth.css
├── GoogleAuth.tsx          # Google OAuth
├── GoogleAuth.css
├── FacebookAuth.tsx        # Facebook OAuth
├── FacebookAuth.css
├── PhoneAuth.tsx           # Téléphone + SMS
└── PhoneAuth.css
```

#### Fonctionnalités des Composants

##### EmailPasswordAuth.tsx
- **Fonctions**: Connexion et inscription
- **Validation**: Vérification des champs obligatoires
- **Gestion d'erreurs**: Messages spécifiques selon le code d'erreur Firebase
- **États**: Mode login/signup avec basculement

##### GoogleAuth.tsx
- **Intégration**: Capacitor Google Auth Plugin
- **Feedback**: Alertes pour chaque étape du processus
- **Redirection**: Navigation automatique vers `/main` après succès

##### FacebookAuth.tsx
- **Permissions**: `email` et `public_profile`
- **Plugin**: Capacitor Facebook Login
- **Gestion**: Similar à Google avec alertes de progression

##### PhoneAuth.tsx
- **reCAPTCHA**: Support natif et web
- **Processus en 2 étapes**: Envoi SMS puis vérification code
- **Validation**: Format international requis (+33123456789)

### 4. Gestion des Données Utilisateur

#### Sauvegarde des Données
```typescript
export const saveUserData = async (user: any) => {
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    phoneNumber: user.phoneNumber,
    photoURL: user.photoURL
  };
  await storageService.set('user', userData);
  await storageService.set('drinkReminder', 20);
  await storageService.set('moveReminder', 20);
};
```

#### Déconnexion
```typescript
export const logout = async () => {
  await signOut(auth);
  await clearUserData();
  return true;
};
```

### 5. Dépendances et Plugins

#### Package.json - Dépendances Principales
```json
{
  "firebase": "^11.0.1",
  "@capacitor-community/facebook-login": "^7.0.0",
  "@codetrix-studio/capacitor-google-auth": "^3.4.0-rc.4",
  "@ionic/storage": "^4.0.0"
}
```

#### Capacitor Plugins
- **Google Auth**: `@codetrix-studio/capacitor-google-auth`
- **Facebook Login**: `@capacitor-community/facebook-login`
- **Storage**: Stockage local des données utilisateur

### 6. Configuration par Plateforme

#### Android
- **google-services.json**: Configuration Firebase pour Android
- **OAuth Client**: Configuré pour Google Sign-In
- **Package Name**: `com.actipop.adroid`

#### iOS (Configuration présente)
- **Bundle ID**: `com.actipop.ios`
- **OAuth Client**: `300243750008-2tvafeivrod3t7qbblpuskefrrd70l5p.apps.googleusercontent.com`

### 7. Sécurité et Bonnes Pratiques

#### Points Forts
- ✅ Configuration Firebase séparée par environnement
- ✅ Gestion centralisée des erreurs d'authentification
- ✅ Nettoyage des données lors de la déconnexion
- ✅ Support reCAPTCHA pour l'authentification téléphone
- ✅ Validation des permissions OAuth

#### Points d'Attention
- ⚠️ Clés API exposées dans le code (normale pour les apps client)
- ⚠️ Messages d'erreur détaillés (peuvent révéler des informations)
- ⚠️ Alertes de débogage en production (à désactiver)

### 8. Flux d'Authentification

#### Connexion Email/Mot de passe
1. Saisie email/mot de passe
2. Validation côté client
3. Appel `signInWithEmailAndPassword`
4. Sauvegarde des données utilisateur
5. Redirection vers `/main`

#### Connexion Google
1. Clic bouton Google
2. Ouverture popup Google OAuth
3. Récupération du token ID
4. Création credential Firebase
5. Connexion Firebase
6. Sauvegarde et redirection

#### Connexion Facebook
1. Clic bouton Facebook
2. Ouverture popup Facebook avec permissions
3. Récupération access token
4. Création credential Firebase
5. Connexion Firebase
6. Sauvegarde et redirection

#### Connexion Téléphone
1. Saisie numéro de téléphone
2. Initialisation reCAPTCHA
3. Envoi code SMS
4. Saisie code reçu
5. Vérification code
6. Connexion et redirection

### 9. Gestion des Erreurs

#### Codes d'Erreur Firebase Gérés
- `auth/user-not-found`: Utilisateur non trouvé
- `auth/wrong-password`: Mot de passe incorrect
- `auth/email-already-in-use`: Email déjà utilisé
- `auth/invalid-email`: Format email invalide
- `auth/weak-password`: Mot de passe trop faible
- `auth/invalid-phone-number`: Numéro téléphone invalide
- `auth/invalid-verification-code`: Code SMS invalide
- `auth/too-many-requests`: Trop de tentatives

### 10. Recommandations d'Amélioration

#### Sécurité
- Implémenter une validation côté serveur
- Ajouter des logs d'audit pour les connexions
- Configurer des règles de sécurité Firebase

#### UX/UI
- Remplacer les alertes par des composants toast
- Ajouter des indicateurs de chargement plus élégants
- Implémenter la récupération de mot de passe

#### Performance
- Mettre en cache les données utilisateur
- Optimiser les appels Firebase
- Implémenter la persistance d'authentification

## Conclusion

Le système d'authentification est bien structuré avec une séparation claire des responsabilités. Il supporte les principales méthodes d'authentification modernes et suit les bonnes pratiques Firebase. Les améliorations suggérées permettraient d'optimiser davantage la sécurité et l'expérience utilisateur.
