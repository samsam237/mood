#!/bin/bash

# Script pour remplacer SafeAreaView par react-native-safe-area-context dans tous les fichiers

echo "🔧 Correction des imports SafeAreaView..."

# Liste des fichiers à traiter
files=(
  "src/screens/MoodEntryScreen.js"
  "src/screens/StatisticsScreen.js"
  "src/screens/SettingsScreen.js"
  "src/screens/ExercisesScreen.js"
  "src/screens/GuidesScreen.js"
  "src/screens/AnalyticsScreen.js"
  "src/screens/PDFViewerScreen.js"
  "src/screens/SystemScreen.js"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Traitement de $file..."
    
    # Créer une sauvegarde
    cp "$file" "$file.backup"
    
    # Remplacer l'import SafeAreaView
    sed -i "s/SafeAreaView,//g" "$file"
    sed -i "s/, SafeAreaView//g" "$file"
    sed -i "s/SafeAreaView//g" "$file"
    
    # Ajouter l'import react-native-safe-area-context si pas déjà présent
    if ! grep -q "react-native-safe-area-context" "$file"; then
      # Trouver la ligne d'import react-native et ajouter après
      sed -i "/from 'react-native';/a import { SafeAreaView } from 'react-native-safe-area-context';" "$file"
    fi
    
    echo "✅ $file traité"
  else
    echo "⚠️ Fichier $file non trouvé"
  fi
done

echo "🎉 Correction terminée !"
echo "💡 Vérifiez les fichiers modifiés avant de commiter"
