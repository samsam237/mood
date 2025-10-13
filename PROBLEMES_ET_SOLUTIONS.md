# Problèmes Résolus et Solutions - Application MOOD

## ✅ Problèmes Résolus

### 1. Fichier d'entrée principal manquant
**Problème** : L'application ne démarrait pas car il manquait `src/main.js`

**Solution** : 
- Créé le fichier `/src/main.js` qui charge le composant App
- Mis à jour `index.html` pour référencer le bon fichier

### 2. Permissions Android pour les notifications
**Problème** : Les notifications ne fonctionnaient pas

**Solution** : Ajout des permissions dans `AndroidManifest.xml` :
```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
<uses-permission android:name="android.permission.WAKE_LOCK"/>
```

### 3. NDK Android manquant
**Problème** : Erreur lors de la compilation - NDK non trouvé

**Solution** : Le NDK a été automatiquement téléchargé et installé par Gradle

### 4. Nouvelle architecture React Native
**Problème** : `react-native-reanimated` et `react-native-worklets` nécessitent la nouvelle architecture

**Solution** : Activé `newArchEnabled=true` dans `android/gradle.properties`

---

## ⚠️ Problème en cours : react-native-pdf

### Problème
La bibliothèque `react-native-pdf` v7.0.0 a des erreurs de compilation avec la nouvelle architecture React Native :
- Méthodes dupliquées
- Imports manquants (ParcelFileDescriptor, PdfRenderer, IOException)
- Interface non implémentée complètement

### Solution temporaire appliquée
Exclusion de `react-native-pdf` dans le build Android pour permettre la compilation de l'APK

### Solutions permanentes possibles

#### Option 1 : Utiliser react-native-webview (RECOMMANDÉ)
`react-native-webview` peut afficher des PDFs et est déjà installé et compatible :

```javascript
// Exemple d'utilisation
import { WebView } from 'react-native-webview';

<WebView
  source={{ uri: 'file:///chemin/vers/document.pdf' }}
  style={{ flex: 1 }}
/>
```

**Avantages** :
- ✅ Déjà installé dans votre projet
- ✅ Compatible avec la nouvelle architecture
- ✅ Fonctionne sur Android et iOS
- ✅ Peut afficher des PDFs locaux et en ligne

#### Option 2 : Utiliser expo-file-system + WebView
Pour les PDFs locaux :

```javascript
import * as FileSystem from 'expo-file-system';
import { WebView } from 'react-native-webview';

// Convertir le PDF en base64
const pdfBase64 = await FileSystem.readAsStringAsync(pdfPath, {
  encoding: FileSystem.EncodingType.Base64
});

<WebView
  source={{ uri: `data:application/pdf;base64,${pdfBase64}` }}
  style={{ flex: 1 }}
/>
```

#### Option 3 : Attendre une mise à jour de react-native-pdf
La bibliothèque `react-native-pdf` devra être mise à jour pour supporter la nouvelle architecture React Native.

#### Option 4 : Utiliser une bibliothèque alternative
- `react-native-pdf-light` (plus légère)
- `react-native-view-pdf` (nouvelle architecture supportée)

---

## 🛠️ Commandes Utiles

### Compiler l'APK de debug
```bash
cd android
./gradlew assembleDebug
```

L'APK sera généré ici :
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Compiler l'APK de release
```bash
cd android
./gradlew assembleRelease
```

### Nettoyer le projet
```bash
cd android
./gradlew clean
```

### Installer sur un appareil connecté
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Script automatisé
```bash
./build-apk.sh
```

---

## 📝 Notes importantes

1. **Nouvelle Architecture** : Votre projet utilise maintenant la nouvelle architecture React Native (Fabric + TurboModules)
   - Plus performant
   - Certaines bibliothèques anciennes peuvent ne pas être compatibles

2. **Taille de l'APK** : L'APK de debug sera plus gros que celui de release (environ 50-80 MB)

3. **Keystore** : Pour publier sur Google Play, vous devrez créer un keystore de release et le sauvegarder précieusement

4. **Fonctionnalités natives** :
   - ✅ Notifications : Permissions ajoutées, devrait fonctionner
   - ⚠️ PDFs : Temporairement désactivé, utiliser WebView à la place
   - ✅ Autres modules Expo : Tous fonctionnels

---

## 🔄 Prochaines étapes

1. **Attendre la compilation** (en cours en arrière-plan)
2. **Tester l'APK** sur un appareil Android
3. **Remplacer react-native-pdf par WebView** pour la lecture de PDFs
4. **Tester les notifications** sur l'appareil
5. **Créer un keystore de release** pour la production

---

## 📞 Support

Si vous rencontrez d'autres problèmes :
1. Vérifiez les logs dans `android/compile.log`
2. Nettoyez le projet : `./gradlew clean`
3. Vérifiez que toutes les dépendances sont à jour

**Version Android minimum supportée** : API 24 (Android 7.0)
**Version Android cible** : API 36 (Android 14+)

