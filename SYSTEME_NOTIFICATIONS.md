# 🔔 Système de Notifications MOOD

## 📋 Améliorations apportées

### 1. **Vibration renforcée** 📳
- Pattern de vibration plus fort : `[0, 500, 200, 500]` (au lieu de `[0, 250, 250, 250]`)
- Priorité MAX pour contourner le mode silencieux
- `bypassDnd: true` pour contourner le mode "Ne pas déranger"

### 2. **Détection automatique des clics sur notifications** 👆
Quand l'utilisateur clique sur une notification :
- **Notification Eau** → Ajoute automatiquement 250ml
- **Notification Mouvement** → Ajoute automatiquement +1 mouvement

### 3. **Calcul intelligent des rappels** ⏰

#### Fréquence par défaut
- **Eau** : Toutes les 2 heures (120 minutes)
- **Mouvement** : Toutes les 2 heures (120 minutes)

#### Calcul du nombre de rappels par jour
```javascript
Nombre de rappels = (heure_coucher - heure_réveil) / intervalle
```

**Exemple :**
- Réveil : 7h00
- Coucher : 22h00
- Intervalle : 120 min (2h)
- **Résultat** : (22h - 7h) / 2h = **7-8 rappels par jour**

#### Heures des rappels (exemple)
Avec réveil à 7h00 et intervalle de 2h :
- 7h00 ✅
- 9h00 ✅
- 11h00 ✅
- 13h00 ✅
- 15h00 ✅
- 17h00 ✅
- 19h00 ✅
- 21h00 ✅

### 4. **Synchronisation temps réel** 🔄

Les compteurs "restants" se mettent à jour :
- ✅ Quand vous cliquez sur les boutons manuellement
- ✅ Quand vous cliquez sur une notification
- ✅ En temps réel sur l'écran d'accueil

### 5. **Architecture du système**

```
┌─────────────────────────────────────┐
│    notificationService.js            │
│  - Planifie les rappels             │
│  - Configure vibration/son          │
│  - Calcule prochains rappels        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   useNotificationHandler (hook)      │
│  - Écoute les clics                 │
│  - Identifie type (eau/mouvement)   │
│  - Déclenche actions                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      HealthContext                   │
│  - addWater(250)                    │
│  - addMovement()                     │
│  - Met à jour AsyncStorage          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      HomeScreen                      │
│  - Affiche compteurs                │
│  - Affiche restants                 │
│  - Affiche prochain rappel          │
└─────────────────────────────────────┘
```

## 🔧 Configuration Android

### Permissions nécessaires (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
```

### Canal de notification
```javascript
{
  name: 'Rappels MOOD',
  importance: MAX,
  vibrationPattern: [0, 500, 200, 500],
  bypassDnd: true,
  sound: 'default'
}
```

## 📊 Données transmises dans les notifications

### Notification Eau
```javascript
{
  type: 'water',
  amount: 250  // ml
}
```

### Notification Mouvement
```javascript
{
  type: 'movement'
}
```

## 🐛 Résolution de problèmes

### Les notifications n'arrivent pas
1. Vérifier les permissions dans les paramètres Android
2. Vérifier que l'app n'est pas optimisée pour la batterie
3. Vérifier dans Paramètres → Objectifs que les heures sont configurées

### Le téléphone ne vibre pas
- Le mode silencieux Android peut bloquer la vibration
- Vérifier Paramètres Android → Sons → Vibration
- Notre config utilise `bypassDnd: true` mais certains fabricants (Samsung, Xiaomi) ont leurs propres restrictions

### Les compteurs ne se mettent pas à jour
1. Vérifier que l'app est bien en arrière-plan (pas fermée complètement)
2. Les logs dans la console doivent montrer : `👆 Utilisateur a cliqué sur la notification`
3. Redémarrer l'app si nécessaire

### Les heures de rappel sont incorrectes
1. Vérifier le fuseau horaire du téléphone
2. Les rappels utilisent les heures du profil (Paramètres → Profil)
3. Modifier dans Objectifs si nécessaire

## 📝 Logs à surveiller

Console pendant le fonctionnement :
```
📬 Notification reçue: {...}
👆 Utilisateur a cliqué sur la notification: {...}
💧 Ajout automatique d'eau depuis la notification
✅ PDF chargé: X pages
📄 Page X/Y
```

## 🎯 Prochaines étapes possibles

- [ ] Ajouter des actions rapides sur les notifications (Boire maintenant / Plus tard)
- [ ] Statistiques des rappels suivis vs ignorés
- [ ] Rappels intelligents basés sur l'historique
- [ ] Son personnalisé pour chaque type de rappel





