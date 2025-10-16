#!/bin/bash
# Script pour compiler l'APK de l'application MOOD

echo "🚀 Compilation de l'APK MOOD..."
echo "================================"
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Aller dans le dossier android
cd "$(dirname "$0")/android" || exit 1

echo -e "${BLUE}📦 Nettoyage du projet...${NC}"
./gradlew clean

echo ""
echo -e "${BLUE}🔨 Compilation de l'APK de release...${NC}"
./gradlew assembleRelease

# Vérifier si la compilation a réussi
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Compilation réussie !${NC}"
    echo ""
    echo "📱 L'APK se trouve ici :"
    APK_PATH="$(pwd)/app/build/outputs/apk/release/app-release.apk"
    echo -e "${GREEN}${APK_PATH}${NC}"
    echo ""
    
    # Afficher la taille de l'APK
    if [ -f "$APK_PATH" ]; then
        SIZE=$(du -h "$APK_PATH" | cut -f1)
        echo "📊 Taille de l'APK : ${SIZE}"
        echo ""
        echo "📤 Pour installer sur votre téléphone :"
        echo "   adb install $APK_PATH"
        echo ""
        echo "📂 Pour ouvrir le dossier :"
        echo "   xdg-open $(dirname "$APK_PATH")"
    fi
else
    echo ""
    echo -e "${RED}❌ La compilation a échoué !${NC}"
    echo ""
    echo "Consultez les erreurs ci-dessus pour plus de détails."
    exit 1
fi

