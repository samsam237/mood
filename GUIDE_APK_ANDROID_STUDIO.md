# 📱 Guide Complet : Créer un APK avec Android Studio

## Prérequis
- ✅ Android Studio installé
- ✅ JDK 17 ou supérieur
- ✅ Android SDK installé

---

## 🚀 Méthode 1 : Avec Android Studio (Interface Graphique)

### Étape 1 : Ouvrir le projet dans Android Studio

1. **Lancez Android Studio**
2. Cliquez sur **"Open"** ou **"Open an Existing Project"**
3. Naviguez vers le dossier : 
   ```
   /home/mrbel/Bureau/PROJET BISSOG/mood/android
   ```
4. Sélectionnez le dossier **android** et cliquez sur **OK**
5. Attendez que Gradle synchronise le projet (cela peut prendre quelques minutes)

### Étape 2 : Synchroniser Gradle

1. Si la synchronisation ne démarre pas automatiquement :
   - Cliquez sur **File → Sync Project with Gradle Files**
   - Ou cliquez sur l'icône "Sync" (🔄) dans la barre d'outils

2. Attendez que toutes les dépendances soient téléchargées

### Étape 3 : Générer l'APK de Debug

1. Dans le menu principal, allez à :
   ```
   Build → Build Bundle(s) / APK(s) → Build APK(s)
   ```

2. Attendez la compilation (cela peut prendre 5-10 minutes la première fois)

3. Une notification apparaîtra en bas à droite : **"APK(s) generated successfully"**

4. Cliquez sur **"locate"** pour ouvrir le dossier contenant l'APK

5. L'APK se trouve ici :
   ```
   /home/mrbel/Bureau/PROJET BISSOG/mood/android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Étape 4 : Générer l'APK de Release (pour production)

1. Dans le menu principal :
   ```
   Build → Build Bundle(s) / APK(s) → Build APK(s)
   ```

2. Ou pour un APK optimisé, générez un Bundle Android :
   ```
   Build → Generate Signed Bundle / APK
   ```

3. Sélectionnez **APK** et cliquez sur **Next**

4. **Configuration du Keystore** (première fois) :
   - Cliquez sur **"Create new..."**
   - Choisissez un emplacement pour votre keystore (ex: `/home/mrbel/mood-release.keystore`)
   - Remplissez les champs :
     - **Key store password** : choisissez un mot de passe fort
     - **Key alias** : mood-key
     - **Key password** : même mot de passe ou différent
     - **Validity** : 25 (années)
     - **First and Last Name** : Votre nom
     - **Organization** : Votre organisation
   - Cliquez sur **OK**

5. Sélectionnez **release** comme build variant

6. Cliquez sur **Finish**

7. L'APK de release se trouvera ici :
   ```
   /home/mrbel/Bureau/PROJET BISSOG/mood/android/app/build/outputs/apk/release/app-release.apk
   ```

---

## ⚡ Méthode 2 : Avec Terminal (Plus Rapide)

### Option A : APK de Debug

Depuis le dossier racine du projet :

```bash
cd /home/mrbel/Bureau/PROJET\ BISSOG/mood
cd android
./gradlew assembleDebug
```

L'APK sera généré ici :
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Option B : APK de Release

```bash
cd /home/mrbel/Bureau/PROJET\ BISSOG/mood/android
./gradlew assembleRelease
```

L'APK sera généré ici :
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 📦 Installer l'APK sur votre téléphone

### Méthode 1 : Avec câble USB

1. Activez le **mode développeur** sur votre téléphone Android :
   - Allez dans **Paramètres → À propos du téléphone**
   - Tapez 7 fois sur **Numéro de build**

2. Activez le **débogage USB** :
   - Allez dans **Paramètres → Options pour les développeurs**
   - Activez **Débogage USB**

3. Connectez votre téléphone à l'ordinateur

4. Installez l'APK :
   ```bash
   cd /home/mrbel/Bureau/PROJET\ BISSOG/mood/android
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

### Méthode 2 : Transfert de fichier

1. Copiez le fichier APK sur votre téléphone (via USB, Bluetooth, email, etc.)

2. Sur votre téléphone :
   - Ouvrez le gestionnaire de fichiers
   - Trouvez le fichier `.apk`
   - Tapez dessus pour l'installer
   - Autorisez l'installation depuis des sources inconnues si demandé

---

## 🔧 Résolution des Problèmes Courants

### Erreur : "SDK location not found"

**Solution :**
Créez le fichier `local.properties` dans le dossier `android/` :

```properties
sdk.dir=/home/VOTRE_NOM/Android/Sdk
```

Remplacez `VOTRE_NOM` par votre nom d'utilisateur.

### Erreur : "Gradle sync failed"

**Solution :**
1. Fermez Android Studio
2. Supprimez les dossiers :
   - `android/.gradle`
   - `android/app/build`
3. Rouvrez Android Studio
4. Relancez la synchronisation

### L'application crash au démarrage

**Vérifications :**
1. Assurez-vous que tous les fichiers JavaScript sont bien compilés
2. Vérifiez les logs Android :
   ```bash
   adb logcat | grep -i "mood"
   ```

### Les notifications ne fonctionnent pas

**Vérifications :**
1. ✅ Les permissions sont déjà ajoutées dans `AndroidManifest.xml`
2. Sur Android 13+, l'utilisateur doit accepter les notifications la première fois
3. Vérifiez dans les paramètres du téléphone que les notifications sont activées pour l'app

---

## 📊 Vérifier la taille de l'APK

```bash
ls -lh /home/mrbel/Bureau/PROJET\ BISSOG/mood/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🎯 Optimiser l'APK

Pour réduire la taille de l'APK, modifiez `android/app/build.gradle` :

```gradle
android {
    ...
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            ...
        }
    }
}
```

---

## 📱 Tester sur un émulateur

1. Dans Android Studio, cliquez sur **Device Manager**
2. Créez un nouvel appareil virtuel (AVD)
3. Lancez l'émulateur
4. Cliquez sur le bouton ▶️ **Run** dans Android Studio

---

## 🔐 Important : Sauvegarder votre Keystore

⚠️ **TRÈS IMPORTANT** ⚠️

Si vous générez un APK de release avec un keystore :
- **Sauvegardez le fichier `.keystore`** en lieu sûr
- **Notez les mots de passe** quelque part de sécurisé
- Sans ce keystore, vous ne pourrez **JAMAIS** publier de mise à jour sur Google Play

---

## 📤 Publier sur Google Play Store

1. Créez un compte développeur Google Play (25$ unique)
2. Générez un **Android App Bundle** (AAB) au lieu d'un APK :
   ```bash
   ./gradlew bundleRelease
   ```
3. Le fichier `.aab` sera dans :
   ```
   android/app/build/outputs/bundle/release/app-release.aab
   ```
4. Uploadez le `.aab` sur Google Play Console

---

## 🆘 Besoin d'aide ?

Logs de compilation :
```bash
cd /home/mrbel/Bureau/PROJET\ BISSOG/mood/android
./gradlew assembleDebug --info
```

Nettoyer le projet :
```bash
./gradlew clean
```

---

**Bonne chance avec la création de votre APK ! 🚀**

