# 🔥 Configuration Firebase - Projet Personnel

## 🎯 **Problème Identifié**

Vous utilisez encore l'ancienne configuration Firebase du projet `actipop-authentication` au lieu de votre propre projet. C'est pourquoi vous avez l'erreur `auth/invalid-credential`.

---

## 🚀 **Solution : Créer Votre Propre Projet Firebase**

### **Étape 1 : Créer un Projet Firebase**

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur **"Ajouter un projet"**
3. **Nom du projet** : `mood-tracker-app` (ou votre choix)
4. **Google Analytics** : Activé (recommandé)
5. Cliquez sur **"Créer un projet"**

### **Étape 2 : Activer l'Authentification**

1. Dans votre projet Firebase, allez dans **"Authentication"**
2. Cliquez sur **"Commencer"**
3. Allez dans l'onglet **"Sign-in method"**
4. Activez **"Google"** :
   - **Nom du projet** : `mood-tracker-app`
   - **Email de support** : Votre email
   - **ID client Web** : Utilisez celui de votre projet Google Cloud
   - **Code secret** : Utilisez celui de votre projet Google Cloud
5. Cliquez sur **"Enregistrer"**

### **Étape 3 : Obtenir la Configuration Firebase**

1. Allez dans **"Paramètres du projet"** (icône d'engrenage)
2. Faites défiler vers le bas jusqu'à **"Vos applications"**
3. Cliquez sur **"Ajouter une application"**
4. Sélectionnez **"Web"** (icône `</>`)
5. **Nom de l'application** : `mood-tracker-web`
6. Cliquez sur **"Enregistrer l'application"**
7. **Copiez la configuration** qui ressemble à :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet",
  storageBucket: "votre-projet.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789",
  measurementId: "G-XXXXXXXXXX"
};
```

### **Étape 4 : Mettre à Jour la Configuration**

Remplacez le contenu de `src/config/firebaseConfig.js` par votre nouvelle configuration :

```javascript
// Configuration Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet",
  storageBucket: "votre-projet.firebasestorage.app",
  messagingSenderId: "VOTRE_SENDER_ID",
  appId: "VOTRE_APP_ID",
  measurementId: "VOTRE_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
```

---

## 🔧 **Configuration Automatique**

### **Script de Configuration Firebase**

Créez un fichier `setup-firebase.sh` :

```bash
#!/bin/bash

echo "🔥 Configuration Firebase - Projet Personnel"
echo "============================================="
echo ""

echo "📋 Instructions :"
echo "1. Allez sur https://console.firebase.google.com/"
echo "2. Créez un nouveau projet"
echo "3. Activez l'authentification Google"
echo "4. Ajoutez une application Web"
echo "5. Copiez la configuration"
echo ""

read -p "Entrez votre API Key Firebase: " API_KEY
read -p "Entrez votre Auth Domain: " AUTH_DOMAIN
read -p "Entrez votre Project ID: " PROJECT_ID
read -p "Entrez votre Storage Bucket: " STORAGE_BUCKET
read -p "Entrez votre Messaging Sender ID: " SENDER_ID
read -p "Entrez votre App ID: " APP_ID
read -p "Entrez votre Measurement ID: " MEASUREMENT_ID

# Créer une sauvegarde
cp src/config/firebaseConfig.js src/config/firebaseConfig.js.backup

# Mettre à jour la configuration
cat > src/config/firebaseConfig.js << EOF
// Configuration Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "$API_KEY",
  authDomain: "$AUTH_DOMAIN",
  projectId: "$PROJECT_ID",
  storageBucket: "$STORAGE_BUCKET",
  messagingSenderId: "$SENDER_ID",
  appId: "$APP_ID",
  measurementId: "$MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
EOF

echo "✅ Configuration Firebase mise à jour"
echo "✅ Sauvegarde créée : src/config/firebaseConfig.js.backup"
echo ""
echo "🚀 Votre authentification Google devrait maintenant fonctionner !"
```

---

## 🎯 **Résultat Attendu**

Après avoir configuré votre propre projet Firebase :

1. **Plus d'erreur** `auth/invalid-credential`
2. **Authentification Google** fonctionnelle
3. **Popup Google** qui s'ouvre correctement
4. **Connexion réussie** avec votre compte Google

---

## 🛠️ **Dépannage**

### **Erreur "Firebase: Error (auth/invalid-credential)" :**
- ✅ Vérifiez que vous utilisez votre propre configuration Firebase
- ✅ Vérifiez que l'authentification Google est activée dans Firebase
- ✅ Vérifiez que les IDs clients correspondent

### **Erreur "Firebase: Error (auth/configuration-not-found)" :**
- ✅ Vérifiez que la configuration Firebase est correcte
- ✅ Vérifiez que le projet Firebase existe

### **Erreur "Firebase: Error (auth/unauthorized-domain)" :**
- ✅ Ajoutez votre domaine dans les domaines autorisés Firebase

---

## 📞 **Support**

Une fois votre projet Firebase configuré :
1. Mettez à jour `src/config/firebaseConfig.js`
2. Redémarrez l'application
3. Testez l'authentification Google

**Votre authentification Google fonctionnera parfaitement !** 🚀











