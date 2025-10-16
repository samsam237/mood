#!/bin/bash

echo "🚀 Configuration de l'authentification Google pour React Native"
echo "=============================================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Node.js et npm sont installés"

# Installer la bibliothèque Google Sign-In
echo "📦 Installation de @react-native-google-signin/google-signin..."
npm install @react-native-google-signin/google-signin

# Installer EAS CLI globalement
echo "📦 Installation d'EAS CLI..."
npm install -g @expo/eas-cli

echo "✅ Dépendances installées avec succès"
echo ""
echo "🔧 Prochaines étapes :"
echo "1. Configurez votre projet dans Google Cloud Console"
echo "2. Obtenez vos identifiants OAuth 2.0"
echo "3. Mettez à jour src/config/googleSigninConfig.js avec vos identifiants"
echo "4. Créez un build de développement avec : eas build:configure"
echo "5. Créez le build avec : eas build --profile development --platform android"
echo ""
echo "📖 Consultez le guide complet : GUIDE_AUTHENTIFICATION_GOOGLE_MOBILE.md"



