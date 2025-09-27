# Mood Tracker App

Une application moderne de suivi de l'humeur avec analytics et lecture de PDF.

## 🚀 Fonctionnalités

- **Suivi de l'humeur** : Enregistrez votre humeur quotidienne avec des notes
- **Analytics avancées** : Graphiques et insights sur vos tendances d'humeur
- **Authentification** : Connexion Google et Facebook
- **Lecteur PDF** : Lecture de documents PDF intégrée
- **Mode sombre** : Support du thème sombre
- **Interface moderne** : Design responsive et accessible

## 📱 Architecture

### Structure du projet
```
src/
├── components/
│   └── common/          # Composants réutilisables
├── screens/             # Écrans de l'application
├── contexts/            # Contextes React (Auth, Mood, Theme)
├── services/            # Services (API, PDF, Analytics)
└── constants/           # Constantes et thème
```

### Technologies utilisées
- **React Native** avec Expo
- **React Navigation** pour la navigation
- **Context API** pour la gestion d'état
- **AsyncStorage** pour le stockage local
- **Expo SecureStore** pour le stockage sécurisé
- **React Native PDF** pour la lecture de PDF
- **React Native Chart Kit** pour les graphiques

## 🛠️ Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd mood-tracker-app
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'authentification**

### Google Sign-In
1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet
3. Activer l'API Google+
4. Créer des identifiants OAuth 2.0
5. Mettre à jour la configuration dans `src/contexts/AuthContext.js`:
```javascript
GoogleSignin.configure({
  webClientId: 'VOTRE_WEB_CLIENT_ID',
  iosClientId: 'VOTRE_IOS_CLIENT_ID',
});
```

### Facebook Login
1. Créer une app Facebook sur [developers.facebook.com](https://developers.facebook.com/)
2. Ajouter le produit Facebook Login
3. Configurer les paramètres de plateforme pour iOS/Android

4. **Démarrer l'application**
```bash
# Démarrer Expo
npx expo start

# Lancer sur iOS
npx expo start --ios

# Lancer sur Android
npx expo start --android

# Lancer sur web
npx expo start --web
```

## 📊 Fonctionnalités détaillées

### Suivi de l'humeur
- Sélection d'humeur avec emojis (Excellent, Bon, Correct, Mauvais, Terrible)
- Notes optionnelles pour chaque entrée
- Sauvegarde locale avec AsyncStorage
- Prévisualisation avant sauvegarde

### Analytics
- Graphique de tendance sur 7 jours
- Vue d'ensemble hebdomadaire
- Distribution des humeurs
- Statistiques (moyenne, streak, meilleur jour)
- Insights personnalisés

### Authentification
- Connexion Google avec gestion des tokens
- Connexion Facebook avec récupération du profil
- Stockage sécurisé des tokens
- Gestion automatique de la session

### Lecteur PDF
- Validation des URLs PDF
- Gestion des erreurs robuste
- Indicateurs de chargement
- Navigation par pages
- Support du zoom

## 🎨 Design System

### Couleurs
- **Primary**: #6366F1 (Indigo)
- **Secondary**: #8B5CF6 (Violet)
- **Success**: #10B981 (Vert)
- **Error**: #EF4444 (Rouge)
- **Warning**: #F59E0B (Orange)

### Typographie
- **H1**: 32px, Bold
- **H2**: 24px, Bold
- **H3**: 20px, SemiBold
- **Body**: 16px, Normal
- **Caption**: 12px, Normal

### Espacement
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px

## 🔧 Configuration

### Variables d'environnement
Créer un fichier `.env` :
```
GOOGLE_WEB_CLIENT_ID=votre_google_web_client_id
GOOGLE_IOS_CLIENT_ID=votre_google_ios_client_id
FACEBOOK_APP_ID=votre_facebook_app_id
```

### Configuration Expo
Le fichier `app.config.js` contient la configuration Expo :
- Nom de l'app
- Identifiants de bundle
- Permissions
- Plugins

## 📱 Déploiement

### Build de production
```bash
# Build pour iOS
npx expo build:ios

# Build pour Android
npx expo build:android

# Ou utiliser EAS Build (recommandé)
npm install -g @expo/eas-cli
eas build --platform all
```

### Tests
```bash
# Tests unitaires
npm run test.unit

# Tests E2E
npm run test.e2e

# Linting
npm run lint
```

## 🐛 Dépannage

### Problèmes courants

1. **Erreur d'authentification Google**
   - Vérifier les identifiants dans Google Cloud Console
   - S'assurer que le SHA-1 est configuré pour Android

2. **PDF ne se charge pas**
   - Vérifier que l'URL est accessible
   - S'assurer que le fichier est un PDF valide

3. **Erreurs de navigation**
   - Vérifier que React Navigation est correctement installé
   - Redémarrer le serveur de développement

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème, ouvrir une issue sur GitHub ou contacter l'équipe de développement.

---

**Mood Tracker v1.0.0** - Fait avec ❤️
