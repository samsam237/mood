#!/bin/bash
echo "🚀 Build RELEASE - Pour distribuer l'app"
echo "========================================="

# Nettoyage complet  
rm -rf node_modules
rm -rf android/app/build
rm -rf android/.cxx
npm install

# Build Release
cd android
./gradlew clean
./gradlew assembleRelease

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ RELEASE BUILD RÉUSSI !"
    echo "📦 APK: android/app/build/outputs/apk/release/app-release.apk"
    echo ""
    echo "📤 Prêt pour la distribution !"
else
    echo "❌ Build release échoué"
fi