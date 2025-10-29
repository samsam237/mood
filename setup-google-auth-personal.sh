#!/bin/bash

# Script pour configurer Google Sign-In avec votre propre projet
echo "🚀 Configuration Google Sign-In - Projet Personnel"
echo "=================================================="
echo ""

# Vérifier si nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur : Ce script doit être exécuté depuis la racine du projet"
    exit 1
fi

echo "📋 Instructions pour créer votre projet Google Cloud :"
echo ""
echo "1. 🌐 Allez sur https://console.cloud.google.com/"
echo "2. 🔐 Connectez-vous avec votre compte Google"
echo "3. ➕ Cliquez sur 'Sélectionner un projet' → 'NOUVEAU PROJET'"
echo "4. 📝 Nom du projet : 'mood-tracker-app' (ou votre choix)"
echo "5. ✅ Cliquez sur 'CRÉER'"
echo ""
echo "📋 APIs à activer :"
echo "- Google Sign-In API"
echo "- Google Identity Platform"
echo ""
echo "📋 IDs clients à créer :"
echo "- Web Application (pour le navigateur)"
echo "- Android Application (pour mobile)"
echo "- iOS Application (optionnel)"
echo ""
echo "🔑 Informations pour Android :"
echo "- Package name: com.yourcompany.moodtracker"
echo "- SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25"
echo ""
echo "📋 URIs autorisées pour Web :"
echo "- http://localhost:19006 (développement)"
echo "- https://votre-domaine.com (production)"
echo ""

# Demander les IDs clients
echo "🔧 Configuration des IDs clients :"
echo ""
read -p "Entrez votre ID client Web (ex: 123456789-abcdef.apps.googleusercontent.com): " WEB_CLIENT_ID
read -p "Entrez votre ID client Android (ex: 123456789-abcdef.apps.googleusercontent.com): " ANDROID_CLIENT_ID
read -p "Entrez votre ID client iOS (optionnel, laissez vide si pas d'iOS): " IOS_CLIENT_ID

# Vérifier que les IDs sont fournis
if [ -z "$WEB_CLIENT_ID" ] || [ -z "$ANDROID_CLIENT_ID" ]; then
    echo "❌ Erreur : Les IDs client Web et Android sont requis"
    exit 1
fi

echo ""
echo "🔧 Mise à jour de la configuration..."

# Créer une sauvegarde
cp src/config/googleSigninConfig.js src/config/googleSigninConfig.js.backup
echo "✅ Sauvegarde créée : src/config/googleSigninConfig.js.backup"

# Mettre à jour la configuration
cat > src/config/googleSigninConfig.js << EOF
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
      // ID client Web
      webClientId: '$WEB_CLIENT_ID',
      // ID client iOS (si fourni)
      ${IOS_CLIENT_ID:+iosClientId: '$IOS_CLIENT_ID',}
      // ID client Android
      androidClientId: '$ANDROID_CLIENT_ID',
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
EOF

echo "✅ Configuration mise à jour avec vos IDs clients"

# Créer un fichier de configuration pour référence
cat > GOOGLE_CONFIG_INFO.txt << EOF
Configuration Google Sign-In - $(date)
=====================================

IDs Clients :
- Web: $WEB_CLIENT_ID
- Android: $ANDROID_CLIENT_ID
${IOS_CLIENT_ID:+- iOS: $IOS_CLIENT_ID}

Package Name: com.yourcompany.moodtracker
SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25

URIs autorisées pour Web :
- http://localhost:19006 (développement)
- https://votre-domaine.com (production)

Fichiers modifiés :
- src/config/googleSigninConfig.js
- GOOGLE_CONFIG_INFO.txt (ce fichier)

Sauvegarde :
- src/config/googleSigninConfig.js.backup
EOF

echo "✅ Fichier de référence créé : GOOGLE_CONFIG_INFO.txt"

echo ""
echo "🎉 Configuration terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Vérifiez que votre projet Google Cloud est configuré"
echo "2. Testez l'application : npm start"
echo "3. Testez sur mobile : npm run android"
echo ""
echo "🔍 En cas de problème :"
echo "- Vérifiez les IDs clients dans Google Cloud Console"
echo "- Vérifiez que les APIs sont activées"
echo "- Vérifiez que l'écran de consentement est configuré"
echo ""
echo "📞 Support :"
echo "- Consultez GOOGLE_CONFIG_INFO.txt pour les détails"
echo "- Consultez GUIDE_GOOGLE_SIGNIN_PERSONNEL.md pour le guide complet"
echo ""
echo "✅ Votre authentification Google est maintenant configurée !"
