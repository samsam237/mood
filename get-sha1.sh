#!/bin/bash

# Script pour obtenir le SHA-1 fingerprint pour Google Sign-In
echo "🔍 Obtention du SHA-1 fingerprint pour Google Sign-In..."

# Vérifier si Java est installé
if ! command -v keytool &> /dev/null; then
    echo "❌ Java n'est pas installé. Veuillez installer Java pour utiliser keytool."
    exit 1
fi

# Chemin vers le keystore debug
DEBUG_KEYSTORE="android/app/debug.keystore"

# Vérifier si le keystore debug existe
if [ ! -f "$DEBUG_KEYSTORE" ]; then
    echo "❌ Le keystore debug n'existe pas à $DEBUG_KEYSTORE"
    echo "💡 Génération du keystore debug..."
    
    # Créer le dossier android/app s'il n'existe pas
    mkdir -p android/app
    
    # Générer le keystore debug
    keytool -genkey -v -keystore "$DEBUG_KEYSTORE" -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android -dname "CN=Android Debug,O=Android,C=US"
    
    if [ $? -eq 0 ]; then
        echo "✅ Keystore debug généré avec succès"
    else
        echo "❌ Erreur lors de la génération du keystore debug"
        exit 1
    fi
fi

echo ""
echo "🔑 SHA-1 Fingerprint pour le keystore debug :"
echo "================================================"

# Obtenir le SHA-1 du keystore debug
SHA1_FINGERPRINT=$(keytool -list -v -keystore "$DEBUG_KEYSTORE" -alias androiddebugkey -storepass android -keypass android 2>/dev/null | grep -A 1 "Empreinte" | tail -1 | cut -d' ' -f3)

if [ -n "$SHA1_FINGERPRINT" ]; then
    echo "SHA-1: $SHA1_FINGERPRINT"
else
    echo "❌ Impossible d'obtenir le SHA-1 fingerprint"
    echo "💡 Tentative alternative..."
    keytool -list -v -keystore "$DEBUG_KEYSTORE" -alias androiddebugkey -storepass android -keypass android 2>/dev/null | grep -E "SHA1|SHA-1"
fi

echo ""
echo "📋 Instructions :"
echo "1. Copiez le SHA-1 fingerprint ci-dessus"
echo "2. Allez sur https://console.developers.google.com/"
echo "3. Sélectionnez votre projet 'actipop-authentication'"
echo "4. Allez dans 'Identifiants' → 'Identifiants OAuth 2.0'"
echo "5. Créez un nouvel 'ID client OAuth 2.0' pour Android"
echo "6. Package name: com.actipop.adroid"
echo "7. SHA-1 fingerprint: [collez le SHA-1 ci-dessus]"
echo ""
echo "✅ Configuration terminée !"







