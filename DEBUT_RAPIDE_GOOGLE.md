# 🚀 Démarrage Rapide - Google Sign-In

## 🎯 **Solution Simple : Créer Votre Propre Configuration**

Puisque vous n'avez pas accès au projet Google Cloud existant, voici la solution la plus simple :

---

## ⚡ **Étapes Rapides (15 minutes)**

### **1. Créer Votre Projet Google Cloud (5 min)**
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Cliquez **"NOUVEAU PROJET"**
3. Nom : `mood-tracker-app`
4. Cliquez **"CRÉER"**

### **2. Activer les APIs (2 min)**
1. **"APIs & Services"** → **"Library"**
2. Recherchez **"Google Sign-In API"** → **"ENABLE"**
3. Recherchez **"Google Identity Platform"** → **"ENABLE"**

### **3. Configurer OAuth (5 min)**
1. **"APIs & Services"** → **"OAuth consent screen"**
2. **"External"** → **"CREATE"**
3. **App name** : `MOOD - Mood Tracker`
4. **Email** : Votre email
5. **"SAVE AND CONTINUE"** (3 fois)

### **4. Créer les IDs Clients (3 min)**
1. **"APIs & Services"** → **"Credentials"**
2. **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**

#### **Web Application :**
- **Name** : `Mood Tracker Web`
- **Authorized JavaScript origins** : `http://localhost:19006`
- **Authorized redirect URIs** : `http://localhost:19006`

#### **Android Application :**
- **Name** : `Mood Tracker Android`
- **Package name** : `com.yourcompany.moodtracker`
- **SHA-1** : `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`

---

## 🔧 **Configuration Automatique**

### **Option 1 : Script Automatique**
```bash
./setup-google-auth-personal.sh
```
Le script vous demandera vos IDs clients et configurera tout automatiquement.

### **Option 2 : Configuration Manuelle**
1. Copiez vos IDs clients depuis Google Cloud Console
2. Modifiez `src/config/googleSigninConfig.js` avec vos IDs
3. Redémarrez l'application

---

## 📋 **Template de Configuration**

Remplacez `VOTRE_ID_CLIENT` par vos vrais IDs :

```javascript
// src/config/googleSigninConfig.js
GoogleSignin.configure({
  webClientId: 'VOTRE_WEB_CLIENT_ID.apps.googleusercontent.com',
  androidClientId: 'VOTRE_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  offlineAccess: true,
  hostedDomain: '',
  forceCodeForRefreshToken: true,
});
```

---

## 🚀 **Test Rapide**

1. **Lancez l'application** : `npm start`
2. **Ouvrez dans le navigateur** : `http://localhost:19006`
3. **Cliquez "Continuer avec Google"**
4. **Le popup Google devrait s'ouvrir !** 🎉

---

## 🛠️ **En cas de Problème**

### **Erreur "Invalid client" :**
- Vérifiez que les IDs clients sont corrects
- Vérifiez que le package name correspond

### **Erreur "Access blocked" :**
- Ajoutez votre email comme utilisateur de test dans OAuth consent screen

### **Erreur "Redirect URI mismatch" :**
- Ajoutez `http://localhost:19006` dans les URIs autorisées

---

## 📞 **Support**

- **Guide complet** : `GUIDE_GOOGLE_SIGNIN_PERSONNEL.md`
- **Script automatique** : `./setup-google-auth-personal.sh`
- **Informations de référence** : `GOOGLE_CONFIG_INFO.txt` (après configuration)

---

## 🎉 **Résultat**

Après 15 minutes, vous aurez :
- ✅ Votre propre projet Google Cloud
- ✅ Authentification Google fonctionnelle
- ✅ Contrôle total sur votre configuration
- ✅ Sécurité maximale

**C'est parti !** 🚀


