# 🚀 Guide Google Sign-In - Configuration Personnelle

## 🎯 **Créer Votre Propre Configuration Google Sign-In**

Puisque vous n'avez pas accès au projet Google Cloud existant, nous allons créer votre propre configuration complète.

---

## 📋 **Étape 1 : Créer un Nouveau Projet Google Cloud**

### **1.1 Accéder à Google Cloud Console :**
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. **Connectez-vous** avec votre compte Google
3. Cliquez sur **"Sélectionner un projet"** en haut à gauche
4. Cliquez sur **"NOUVEAU PROJET"**

### **1.2 Créer le Projet :**
1. **Nom du projet** : `mood-tracker-app` (ou le nom de votre choix)
2. **Organisation** : Laissez par défaut
3. **Emplacement** : Laissez par défaut
4. Cliquez sur **"CRÉER"**

### **1.3 Activer les APIs :**
1. Allez dans **"APIs & Services"** → **"Library"**
2. Recherchez **"Google Sign-In API"** et cliquez sur **"ENABLE"**
3. Recherchez **"Google Identity Platform"** et cliquez sur **"ENABLE"**

---

## 🔑 **Étape 2 : Configurer l'Écran de Consentement OAuth**

### **2.1 Configurer l'Écran de Consentement :**
1. Allez dans **"APIs & Services"** → **"OAuth consent screen"**
2. Sélectionnez **"External"** (pour les utilisateurs externes)
3. Cliquez sur **"CREATE"**

### **2.2 Remplir les Informations :**
1. **App name** : `MOOD - Mood Tracker`
2. **User support email** : Votre email
3. **Developer contact information** : Votre email
4. Cliquez sur **"SAVE AND CONTINUE"**

### **2.3 Scopes (Étendues) :**
1. Cliquez sur **"ADD OR REMOVE SCOPES"**
2. Ajoutez ces scopes :
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
3. Cliquez sur **"UPDATE"** puis **"SAVE AND CONTINUE"**

### **2.4 Test Users (Utilisateurs de Test) :**
1. Ajoutez votre email comme utilisateur de test
2. Cliquez sur **"SAVE AND CONTINUE"**

---

## 🆔 **Étape 3 : Créer les Identifiants OAuth 2.0**

### **3.1 ID Client Web :**
1. Allez dans **"APIs & Services"** → **"Credentials"**
2. Cliquez sur **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Sélectionnez **"Web application"**
4. **Name** : `Mood Tracker Web`
5. **Authorized JavaScript origins** :
   - `http://localhost:19006` (pour le développement)
   - `https://votre-domaine.com` (si vous avez un domaine)
6. **Authorized redirect URIs** :
   - `http://localhost:19006` (pour le développement)
   - `https://votre-domaine.com` (si vous avez un domaine)
7. Cliquez sur **"CREATE"**
8. **Copiez l'ID client Web** (vous en aurez besoin)

### **3.2 ID Client Android :**
1. Cliquez sur **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
2. Sélectionnez **"Android"**
3. **Name** : `Mood Tracker Android`
4. **Package name** : `com.yourcompany.moodtracker`
5. **SHA-1 certificate fingerprint** : `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
6. Cliquez sur **"CREATE"**
7. **Copiez l'ID client Android** (vous en aurez besoin)

### **3.3 ID Client iOS (Optionnel) :**
1. Cliquez sur **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
2. Sélectionnez **"iOS"**
3. **Name** : `Mood Tracker iOS`
4. **Bundle ID** : `com.yourcompany.moodtracker`
5. Cliquez sur **"CREATE"**
6. **Copiez l'ID client iOS** (vous en aurez besoin)

---

## 🔧 **Étape 4 : Mettre à Jour la Configuration**

### **4.1 Mettre à jour googleSigninConfig.js :**
Remplacez le contenu du fichier `src/config/googleSigninConfig.js` par :

```javascript
// Import conditionnel pour éviter l'erreur en mode développement
let GoogleSignin = null;

try {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
} catch (error) {
  console.log('GoogleSignin non disponible:', error.message);
}

// Configuration Google Sign-In
export const configureGoogleSignIn = () => {
  if (GoogleSignin) {
    GoogleSignin.configure({
      // Remplacez par votre ID client Web
      webClientId: 'VOTRE_WEB_CLIENT_ID.apps.googleusercontent.com',
      // Remplacez par votre ID client iOS (si vous en avez un)
      iosClientId: 'VOTRE_IOS_CLIENT_ID.apps.googleusercontent.com',
      // Remplacez par votre ID client Android
      androidClientId: 'VOTRE_ANDROID_CLIENT_ID.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '',
      forceCodeForRefreshToken: true,
      accountName: '',
    });
    console.log('Google Sign-In configuré avec succès');
  } else {
    console.log('GoogleSignin non configuré - mode développement');
  }
};

export default configureGoogleSignIn;
```

### **4.2 Mettre à jour firebaseConfig.js :**
Si vous utilisez Firebase, mettez à jour le fichier `src/config/firebaseConfig.js` avec votre configuration Firebase.

---

## 🚀 **Étape 5 : Tester la Configuration**

### **5.1 Test sur Web :**
1. Lancez l'application : `npm start`
2. Ouvrez dans le navigateur
3. Cliquez sur "Continuer avec Google"
4. Le popup Google devrait s'ouvrir

### **5.2 Test sur Mobile :**
1. Lancez l'application sur Android : `npm run android`
2. Cliquez sur "Continuer avec Google"
3. L'interface Google native devrait s'ouvrir

---

## 🛠️ **Dépannage**

### **Erreur "Invalid client" :**
- Vérifiez que les IDs clients sont corrects
- Vérifiez que le package name correspond
- Vérifiez que le SHA-1 est correct

### **Erreur "Access blocked" :**
- Vérifiez que l'écran de consentement est configuré
- Ajoutez votre email comme utilisateur de test
- Vérifiez que les APIs sont activées

### **Erreur "Redirect URI mismatch" :**
- Vérifiez les URIs autorisées dans la configuration OAuth
- Ajoutez `http://localhost:19006` pour le développement

---

## 📋 **Résumé des IDs à Récupérer**

Après avoir créé votre projet Google Cloud, vous devriez avoir :

1. **ID Client Web** : `XXXXXXXX-XXXXXXXX.apps.googleusercontent.com`
2. **ID Client Android** : `XXXXXXXX-XXXXXXXX.apps.googleusercontent.com`
3. **ID Client iOS** : `XXXXXXXX-XXXXXXXX.apps.googleusercontent.com` (optionnel)

---

## 🎉 **Avantages de Votre Propre Configuration**

- ✅ **Contrôle total** sur votre projet
- ✅ **Sécurité** - Vos propres credentials
- ✅ **Personnalisation** - Votre propre nom d'application
- ✅ **Évolutivité** - Vous pouvez ajouter d'autres fonctionnalités

---

## 💡 **Prochaines Étapes**

1. **Créez votre projet Google Cloud** (5 minutes)
2. **Configurez OAuth** (10 minutes)
3. **Créez les IDs clients** (5 minutes)
4. **Mettez à jour la configuration** (2 minutes)
5. **Testez l'application** (2 minutes)

**Total : ~25 minutes pour une configuration complète !**

---

## 📞 **Support**

Si vous rencontrez des problèmes :
1. Vérifiez que tous les IDs clients sont corrects
2. Assurez-vous que les APIs sont activées
3. Vérifiez que l'écran de consentement est configuré
4. Consultez les logs de l'application

**Vous aurez votre propre authentification Google fonctionnelle !** 🚀
