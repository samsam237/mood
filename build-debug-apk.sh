#!/bin/bash
# Script pour compiler l'APK DEBUG de l'application MOOD

echo "🚀 Build DEBUG - Pour tester les notifications"
echo "=============================================="
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⚠️  NETTOYAGE COMPLET DES CACHES...${NC}"
echo ""

# 🔥 NETTOYAGE COMPLET
echo -e "${BLUE}🧹 Nettoyage des caches React/Node...${NC}"
rm -rf node_modules
rm -rf package-lock.json
rm -rf .expo

echo -e "${BLUE}🧹 Nettoyage des caches Android...${NC}"
rm -rf android/app/build
rm -rf android/.cxx
rm -rf android/.gradle

echo -e "${BLUE}📦 Réinstallation des dépendances...${NC}"
npm install

echo -e "${BLUE}🛠️  Pré-build Expo...${NC}"
npx expo prebuild --clean

# Aller dans le dossier android
cd android || exit 1

echo ""
echo -e "${BLUE}📦 Nettoyage Gradle...${NC}"
./gradlew clean

echo ""
echo -e "${BLUE}🔨 Compilation de l'APK DEBUG...${NC}"
./gradlew assembleDebug

# Vérifier si la compilation a réussi
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ BUILD DEBUG RÉUSSI !${NC}"
    echo ""
    
    APK_DEBUG="app/build/outputs/apk/debug/app-debug.apk"
    
    if [ -f "$APK_DEBUG" ]; then
        SIZE_DEBUG=$(du -h "$APK_DEBUG" | cut -f1)
        echo -e "${GREEN}📱 APK Debug: $APK_DEBUG (${SIZE_DEBUG})${NC}"
        echo ""
        echo "📲 Pour installer sur ton téléphone :"
        echo "   adb install $APK_DEBUG"
        echo ""
        echo "🎯 Les notifications DEVRAIENT FONCTIONNER dans cet APK !"
    fi
    
    # Retour au dossier principal
    cd ..
    
else
    echo ""
    echo -e "${RED}❌ La compilation DEBUG a échoué !${NC}"
    echo ""
    echo -e "${YELLOW}💡 Solution alternative :${NC}"
    echo "   npm install -g @expo/eas-cli"
    echo "   eas build --platform android --profile preview"
    cd ..
    exit 1
fi