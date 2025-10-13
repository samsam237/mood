# Guide d'Authentification - Mood Tracker

## Vue d'ensemble

Le système d'authentification de Mood Tracker utilise Firebase Authentication et propose trois méthodes de connexion :

1. **Email et mot de passe** (connexion/inscription)
2. **Google Sign-In** 
3. **Facebook Login**
4. **Connexion rapide (Demo)** - pour le développement

## Configuration

### Firebase Configuration

Le projet utilise Firebase avec la configuration suivante :
- **Project ID**: actipop-authentication
- **Auth Domain**: actipop-authentication.firebaseapp.com

### Identifiants par défaut (Développement)

Pour faciliter les tests, des identifiants par défaut sont configurés :

```
Email: demo@moodtracker.com
Mot de passe: demo123
```

## Fonctionnalités

### Page de Connexion

L'écran d'authentification (`AuthScreen.js` / `AuthScreen.web.js`) propose :

#### 1. Toggle Connexion/Inscription
- Interface permettant de basculer entre connexion et inscription
- Validation des champs requis
- Vérification de correspondance des mots de passe

#### 2. Formulaire Email/Mot de passe
- **Connexion** : Email + Mot de passe
- **Inscription** : Nom d'utilisateur + Email + Mot de passe + Confirmation

#### 3. Connexions Sociales
- **Google** : Utilise Firebase Google Auth Provider
- **Facebook** : Utilise Firebase Facebook Auth Provider
- **Demo** : Connexion rapide avec identifiants par défaut

### Gestion de l'État

Le contexte d'authentification (`AuthContext.js`) gère :
- État de l'utilisateur connecté
- État de chargement
- Méthodes d'authentification
- Déconnexion

### Navigation Conditionnelle

L'application utilise une navigation conditionnelle :
- **Non connecté** : Affichage de l'écran d'authentification
- **Connecté** : Accès à l'application principale
- **Chargement** : Écran de chargement

## Utilisation

### Connexion

1. **Avec identifiants par défaut** :
   - Cliquer sur "Connexion rapide (Demo)"
   - Connexion automatique avec `demo@moodtracker.com`

2. **Avec email/mot de passe** :
   - Sélectionner "Connexion"
   - Saisir email et mot de passe
   - Cliquer sur "Se connecter"

3. **Avec Google/Facebook** :
   - Cliquer sur le bouton correspondant
   - Suivre le processus OAuth

### Inscription

1. Sélectionner "Inscription"
2. Remplir le formulaire :
   - Nom d'utilisateur
   - Email
   - Mot de passe
   - Confirmation du mot de passe
3. Cliquer sur "S'inscrire"

### Déconnexion

1. Aller dans "Paramètres"
2. Cliquer sur "Se déconnecter"
3. Confirmer la déconnexion

## Messages d'Erreur

Le système affiche des messages d'erreur traduits en français :

- `auth/user-not-found`: "Aucun compte trouvé avec cet email"
- `auth/wrong-password`: "Mot de passe incorrect"
- `auth/email-already-in-use`: "Un compte existe déjà avec cet email"
- `auth/weak-password`: "Le mot de passe doit contenir au moins 6 caractères"
- `auth/invalid-email`: "Adresse email invalide"
- `auth/too-many-requests`: "Trop de tentatives. Réessayez plus tard"

## Sécurité

### Bonnes Pratiques

1. **Validation côté client** : Vérification des champs requis
2. **Messages d'erreur sécurisés** : Pas d'exposition d'informations sensibles
3. **Gestion des états de chargement** : Prévention des clics multiples
4. **Déconnexion propre** : Nettoyage de l'état utilisateur

### Configuration Firebase

Pour activer les méthodes d'authentification dans Firebase Console :

1. Aller dans **Authentication** → **Sign-in method**
2. Activer :
   - ✅ Email/Password
   - ✅ Google
   - ✅ Facebook (si configuré)

## Développement

### Création d'Utilisateur par Défaut

Pour créer l'utilisateur de démonstration :

```javascript
import { createDefaultUser } from './src/utils/createDefaultUser';

// Créer l'utilisateur par défaut
await createDefaultUser();
```

### Test de Connexion

```javascript
import { testDefaultLogin } from './src/utils/createDefaultUser';

// Tester la connexion par défaut
await testDefaultLogin();
```

## Structure des Fichiers

```
src/
├── config/
│   ├── firebaseConfig.js      # Configuration Firebase
│   └── authConfig.js          # Configuration des providers
├── contexts/
│   └── AuthContext.js         # Contexte d'authentification
├── services/
│   └── authService.js         # Service d'authentification Firebase
├── screens/
│   ├── AuthScreen.js          # Écran d'auth mobile
│   └── AuthScreen.web.js      # Écran d'auth web
├── utils/
│   └── createDefaultUser.js   # Utilitaires pour utilisateur par défaut
└── components/
    └── common/
        └── Button.js          # Composant bouton réutilisable
```

## Prochaines Étapes

1. **Configuration des providers sociaux** :
   - Configurer les clés Google OAuth
   - Configurer l'App Facebook (si nécessaire)

2. **Améliorations possibles** :
   - Réinitialisation de mot de passe
   - Vérification d'email
   - Authentification à deux facteurs
   - Gestion des profils utilisateur

3. **Tests** :
   - Tests unitaires pour les services d'auth
   - Tests d'intégration pour les flux de connexion
   - Tests E2E pour l'expérience utilisateur complète
