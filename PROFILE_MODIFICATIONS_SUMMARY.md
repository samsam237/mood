# 📝 MODIFICATIONS PROFIL - Calcul Automatique

## ✅ FONCTIONNALITÉS AJOUTÉES

### 1. **Champ "Niveau d'Activité"** 🏃
Ajout d'un nouveau champ pour sélectionner le niveau d'activité :
- Sédentaire
- Légèrement actif
- Modérément actif
- Très actif

### 2. **Calcul Automatique - Masse Grasse (%)** 📊
**Formule utilisée** : Deurenberg simplifiée
- Calcul basé sur : IMC, Âge, Poids
- Affichage automatique après saisie des données

### 3. **Calcul Automatique - Masse Musculaire (kg)** 💪
**Formule utilisée** : 
- Masse musculaire = Poids - (Poids × %Graisse)
- Affichage automatique

### 4. **Calcul Automatique - Eau Recommandée (mL)** 💧
**Formule utilisée** :
- Base : 33 mL par kg de poids
- Ajustement selon l'âge :
  - < 30 ans : +10%
  - > 60 ans : -10%
- Ajustement selon l'activité :
  - Sédentaire : x1.0
  - Légèrement actif : x1.1
  - Modérément actif : x1.3
  - Très actif : x1.5

**Utilisation automatique** : L'eau recommandée devient l'objectif quotidien dans l'app !

---

## 📱 INTERFACE UTILISATEUR

### Sections ajoutées :

1. **Composition Corporelle** (visible uniquement si calculable)
   - Masse grasse en %
   - Masse musculaire en kg
   - Note : "Calculé automatiquement"

2. **Niveau d'Activité**
   - 4 boutons sélectionnables
   - Bouton actif en couleur primaire

3. **Hydratation Recommandée** (visible uniquement si calculable)
   - Quantité en mL
   - Note : "Calculé automatiquement"

---

## 🔧 MODIFICATIONS TECHNIQUES

### Fichiers modifiés :

1. **`src/locales/fr.json`** & **`src/locales/en.json`**
   - Ajout des traductions pour tous les nouveaux champs

2. **`src/screens/ProfileScreen.js`**
   - Ajout du state `activityLevel`
   - Ajout des 3 fonctions de calcul
   - Ajout des sections d'affichage
   - Ajout des styles

3. **`src/contexts/HealthContext.js`**
   - Mise à jour de `updateUserProfile` pour synchroniser l'objectif d'eau

---

## 💾 DONNÉES ENREGISTRÉES

Lors de l'enregistrement du profil, les données suivantes sont stockées :
```javascript
{
  name: string,
  age: number,
  weight: number,
  height: number,
  activityLevel: 'sedentary' | 'lightlyActive' | 'moderatelyActive' | 'veryActive',
  bodyFat: number,           // Calculé automatiquement
  muscleMass: number,        // Calculé automatiquement
  recommendedWater: number,  // Calculé automatiquement
  wakeTime: string,
  sleepTime: string,
  waterReminderFrequency: number,
  moveReminderFrequency: number
}
```

---

## 🎯 AVANTAGES

1. **Expérience utilisateur améliorée** : Pas besoin de saisir les données calculables
2. **Personnalisation** : Les calculs s'adaptent à l'utilisateur (âge, poids, activité)
3. **Objectif adaptatif** : L'objectif d'eau s'ajuste automatiquement
4. **Données cohérentes** : Toutes les données sont liées et synchronisées

---

**Date** : 2024
**Version** : 1.0.0
