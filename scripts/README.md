# 📚 Système de Gestion Automatique des PDFs

## 🎯 Comment ça fonctionne

Ce système scanne automatiquement les dossiers de PDFs et génère un catalogue JSON qui est ensuite utilisé par l'application.

## 📁 Structure des dossiers

```
public/assets/pdfs/
├── hydratation/     ← PDFs sur l'hydratation
│   ├── 1.pdf
│   ├── 2.pdf
│   └── ...
└── exercice/        ← PDFs sur les exercices
    ├── PREVENTION DES CHUTES.pdf
    ├── GYM SUR CHAISE.pdf
    └── ...
```

## 🚀 Utilisation

### Ajouter de nouveaux PDFs

1. **Copiez vos PDFs** dans le bon dossier :
   - Hydratation → `public/assets/pdfs/hydratation/`
   - Exercices → `public/assets/pdfs/exercice/`

2. **Générez le catalogue** :
   ```bash
   npm run generate-pdfs
   ```

3. **C'est tout !** Les PDFs apparaîtront automatiquement dans l'application

### Commande de génération

```bash
npm run generate-pdfs
```

Cette commande :
- ✅ Scanne les dossiers `hydratation/` et `exercice/`
- ✅ Génère automatiquement les titres à partir des noms de fichiers
- ✅ Attribue des icônes selon le contenu
- ✅ Crée le fichier `public/data/pdf-catalog.json`
- ✅ Affiche un résumé des PDFs trouvés

## 📊 Exemple de sortie

```
🔍 Scanning PDF directories...

✅ PDF catalog generated successfully!

📊 Statistics:
   - Hydratation: 8 documents
   - Exercices: 43 documents
   - Total: 51 documents

📁 Output: public/data/pdf-catalog.json
```

## 🔧 Fichier généré

Le fichier `pdf-catalog.json` contient :

```json
{
  "hydratation": [
    {
      "id": 1,
      "title": "Nom du fichier",
      "file": "hydratation/1.pdf",
      "icon": "water-drop"
    }
  ],
  "exercices": [...],
  "metadata": {
    "totalDocuments": 51,
    "hydratationCount": 8,
    "exercicesCount": 43,
    "lastUpdated": "2025-10-08T12:00:00.000Z"
  }
}
```

## 💡 Conseils

- Utilisez des **noms de fichiers descriptifs** pour des titres automatiques plus clairs
- **Relancez le script** chaque fois que vous ajoutez/supprimez des PDFs
- Le script est **idempotent** : vous pouvez l'exécuter autant de fois que vous voulez

## 🎨 Personnaliser les titres

Si vous voulez personnaliser les titres ou icônes, éditez directement le fichier généré `public/data/pdf-catalog.json`.

Le script écrasera vos modifications à la prochaine exécution, donc gardez une copie si nécessaire.

