# Guide de débogage mobile

## 🚀 **Méthodes de débogage sur mobile**

### 1. **Chrome DevTools (Recommandé)**

#### Configuration :
1. **Sur votre mobile :**
   - Ouvrez Chrome
   - Allez dans `chrome://inspect`
   - Activez "Discover USB devices"

2. **Sur votre ordinateur :**
   - Connectez le mobile via USB
   - Ouvrez Chrome sur l'ordinateur
   - Allez dans `chrome://inspect`
   - Vous verrez votre appareil et l'app

3. **Lancez l'app en mode debug :**
   ```bash
   ionic cap run android --livereload
   # ou
   ionic cap run ios --livereload
   ```

### 2. **Alertes visuelles (Déjà configurées)**

J'ai ajouté des alertes visuelles qui s'affichent sur mobile :

- 🔄 **Début de processus**
- ✅ **Succès**
- ❌ **Erreur**
- 💾 **Sauvegarde des données**

### 3. **Logs Capacitor**

Pour voir les logs Capacitor sur mobile :

```bash
# Android
ionic cap run android --livereload --consolelogs

# iOS
ionic cap run ios --livereload --consolelogs
```

### 4. **Débogage avec ADB (Android)**

```bash
# Voir les logs Android
adb logcat | grep -E "(Capacitor|Ionic|Firebase)"

# Filtrer par votre app
adb logcat | grep "io.ionic.starter"
```

## 🔍 **Étapes de test**

### Test Google Auth :
1. Cliquez sur "Google"
2. Vous devriez voir : "🔄 Début de la connexion Google..."
3. Si succès : "✅ Google login successful!"
4. Si erreur : "❌ Erreur de connexion Google: [détails]"

### Test Facebook Auth :
1. Cliquez sur "Facebook"
2. Vous devriez voir : "🔄 Début de la connexion Facebook..."
3. Si succès : "✅ Facebook login successful!"
4. Si erreur : "❌ Erreur de connexion Facebook: [détails]"

### Test Phone Auth :
1. Entrez un numéro (ex: +33123456789)
2. Cliquez sur "Envoyer le code"
3. Vous devriez voir : "🔄 Envoi du code SMS..."
4. Si succès : "✅ Code SMS envoyé avec succès!"
5. Entrez le code reçu
6. Cliquez sur "Vérifier le code"
7. Vous devriez voir : "✅ Code vérifié avec succès!"

## 🛠️ **Problèmes courants et solutions**

### Google Auth ne fonctionne pas :
- Vérifiez la configuration OAuth dans `capacitor.config.ts`
- Assurez-vous que le package `@codetrix-studio/capacitor-google-auth` est installé
- Vérifiez la configuration Firebase Console

### Facebook Auth ne fonctionne pas :
- Vérifiez la configuration Facebook App
- Assurez-vous que le package `@capacitor-community/facebook-login` est installé
- Vérifiez les permissions dans Facebook Console

### Phone Auth ne fonctionne pas :
- Vérifiez que Firebase Phone Auth est activé
- Assurez-vous que reCAPTCHA est configuré
- Vérifiez le format du numéro (international)

## 📱 **Commandes utiles**

```bash
# Nettoyer et reconstruire
ionic cap clean
ionic cap sync
ionic cap run android --livereload

# Voir les logs en temps réel
ionic cap run android --livereload --consolelogs

# Tester sur navigateur (plus facile pour déboguer)
ionic serve
```

## 🎯 **Prochaines étapes**

1. **Testez chaque méthode d'authentification** avec les alertes visuelles
2. **Notez les messages d'erreur** que vous voyez
3. **Utilisez Chrome DevTools** si possible pour plus de détails
4. **Partagez les messages d'erreur** que vous obtenez

Les alertes visuelles vous donneront maintenant des informations claires sur ce qui se passe lors de l'authentification !


