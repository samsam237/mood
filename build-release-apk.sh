#!/bin/bash
# Script pour compiler l'APK RELEASE de l'application MOOD

echo "🚀 Build RELEASE - Pour distribuer l'app"
echo "========================================="
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
echo -e "${BLUE}🔨 Test de compilation DEBUG d'abord...${NC}"
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Test DEBUG réussi, compilation RELEASE...${NC}"
    
    echo ""
    echo -e "${BLUE}🔐 Génération de l'APK RELEASE...${NC}"
    ./gradlew assembleRelease
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}🎉 BUILD RELEASE RÉUSSI !${NC}"
        echo ""
        
        APK_RELEASE="app/build/outputs/apk/release/app-release.apk"
        
        if [ -f "$APK_RELEASE" ]; then
            SIZE_RELEASE=$(du -h "$APK_RELEASE" | cut -f1)
            echo -e "${GREEN}📦 APK Release: $APK_RELEASE (${SIZE_RELEASE})${NC}"
            echo ""
            echo "🚀 Prêt pour la distribution sur le Play Store !"
            echo ""
            echo "📤 Les notifications FONCTIONNERONT dans cette version !"
        fi
        
        # Retour au dossier principal
        cd ..
        
    else
        echo ""
        echo -e "${RED}❌ La compilation RELEASE a échoué !${NC}"
        cd ..
        exit 1
    fi
else
    echo ""
    echo -e "${RED}❌ Le test DEBUG a échoué, impossible de compiler RELEASE${NC}"
    echo ""
    echo -e "${YELLOW}💡 Compile d'abord en DEBUG pour tester :${NC}"
    echo "   ./build-debug.sh"
    cd ..
    exit 1
fi