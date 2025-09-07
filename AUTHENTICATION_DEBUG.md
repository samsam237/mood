# Guide de débogage de l'authentification

## Problèmes identifiés et solutions

### 1. **Authentification Google**
**Problème possible :** Configuration des clés OAuth ou plugin Capacitor

**Vérifications :**
- Ouvrez la console du navigateur (F12)
- Cliquez sur le bouton Google
- Regardez les logs dans la console

**Messages attendus :**
```
Tentative de connexion Google...
Début de la connexion Google...
Google user reçu: [objet]
Credential créé: [objet]
Connexion Firebase réussie: [objet]
Google login successful: [objet]
User data saved
```

**Solutions si erreur :**
1. Vérifiez que `capacitor.config.ts` contient les bonnes clés OAuth
2. Assurez-vous que le plugin Google Auth est correctement installé
3. Vérifiez la configuration Firebase Console

### 2. **Authentification Facebook**
**Problème possible :** Configuration Facebook App ou plugin Capacitor

**Vérifications :**
- Ouvrez la console du navigateur (F12)
- Cliquez sur le bouton Facebook
- Regardez les logs dans la console

**Messages attendus :**
```
Tentative de connexion Facebook...
Début de la connexion Facebook...
Facebook login result: [objet]
Facebook credential créé: [objet]
Connexion Firebase réussie: [objet]
Facebook login successful: [objet]
User data saved
```

**Solutions si erreur :**
1. Vérifiez la configuration Facebook App dans Facebook Developers
2. Assurez-vous que l'App ID Facebook est correct
3. Vérifiez les permissions dans Facebook Console

### 3. **Authentification par téléphone**
**Problème possible :** Configuration reCAPTCHA ou Firebase Phone Auth

**Vérifications :**
- Ouvrez la console du navigateur (F12)
- Entrez un numéro de téléphone (format international : +33123456789)
- Cliquez sur "Envoyer le code"
- Regardez les logs dans la console

**Messages attendus :**
```
Début de la connexion par téléphone... +33123456789
Code SMS envoyé avec succès
```

**Solutions si erreur :**
1. Vérifiez que reCAPTCHA est correctement configuré
2. Assurez-vous que Firebase Phone Auth est activé
3. Vérifiez que le numéro est au format international

## Configuration requise

### Firebase Console
1. **Authentication** → **Sign-in method**
2. Activez les méthodes :
   - Email/Password ✅
   - Google ✅
   - Facebook ✅
   - Phone ✅

### Capacitor Plugins
```bash
npm install @codetrix-studio/capacitor-google-auth
npm install @capacitor-community/facebook-login
```

### Configuration Android
1. Ajoutez les clés dans `android/app/src/main/res/values/strings.xml`
2. Configurez les permissions dans `android/app/src/main/AndroidManifest.xml`

## Tests recommandés

1. **Test en mode développement :**
   - Utilisez `ionic serve` pour tester sur navigateur
   - Vérifiez les logs de la console

2. **Test sur appareil :**
   - Utilisez `ionic cap run android` ou `ionic cap run ios`
   - Testez chaque méthode d'authentification

3. **Vérification des erreurs :**
   - Regardez les messages d'erreur dans la console
   - Vérifiez les logs Firebase
   - Consultez les logs Capacitor

## Messages d'erreur courants

- **"Aucun token ID reçu de Google"** → Problème de configuration OAuth
- **"Aucun jeton d'accès Facebook reçu"** → Problème de configuration Facebook
- **"reCAPTCHA non initialisé"** → Problème de configuration reCAPTCHA
- **"Le numéro de téléphone est invalide"** → Format de numéro incorrect
