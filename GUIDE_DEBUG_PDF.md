# 🔧 Guide de Debug des PDFs

## 🎯 Problème Identifié

Les logs montrent que l'URI du PDF est `undefined`, ce qui signifie que les paramètres ne sont pas correctement passés entre les écrans.

## 🔍 Modifications Apportées

### 1. **Logs de Debug Ajoutés**
- ✅ Logs dans `GuidesScreen.js` et `GuidesScreen.web.js`
- ✅ Logs dans `PDFViewerScreen.js` pour voir les paramètres reçus
- ✅ Logs dans `UniversalPDFViewer.js` pour voir l'URL finale

### 2. **Composant de Test Ajouté**
- ✅ `PDFTest.js` : Teste l'accessibilité des PDFs
- ✅ Intégré temporairement dans `GuidesScreen.web.js`

### 3. **Gestion des URLs Améliorée**
- ✅ Construction automatique de l'URL complète dans `UniversalPDFViewer`
- ✅ Support des URLs relatives et absolues

## 🧪 Comment Tester

### Étape 1 : Vérifier les Logs
1. Ouvrez l'écran "Guides"
2. Cliquez sur un PDF
3. Regardez les logs dans la console :
   ```
   📄 Ouverture PDF (Web): {id: 1, title: "1", file: "hydratation/1.pdf", ...}
   🔗 Chemin PDF construit: /assets/pdfs/hydratation/1.pdf
   🔍 Paramètres reçus: {pdfUrl: "/assets/pdfs/hydratation/1.pdf", ...}
   📄 Source finale: {uri: "/assets/pdfs/hydratation/1.pdf"}
   🌐 Source finale pour viewer: {uri: "http://localhost:3000/assets/pdfs/hydratation/1.pdf"}
   ```

### Étape 2 : Utiliser le Composant de Test
1. Dans l'écran Guides, utilisez le bouton "Tester l'Accès PDF"
2. Cela testera si le PDF est accessible via HTTP
3. Vous verrez le résultat dans une alerte

### Étape 3 : Vérifier l'URL Directe
1. Ouvrez votre navigateur
2. Allez à : `http://localhost:3000/assets/pdfs/hydratation/1.pdf`
3. Le PDF devrait s'afficher directement

## 🔧 Solutions Possibles

### Si le Test PDF Échoue :
1. **Vérifiez que le serveur de dev fonctionne**
2. **Vérifiez que les fichiers sont dans `public/assets/pdfs/`**
3. **Vérifiez la configuration Vite**

### Si les Paramètres sont undefined :
1. **Vérifiez la navigation dans React Navigation**
2. **Vérifiez que les paramètres sont bien passés**

### Si l'URL est Incorrecte :
1. **Vérifiez la construction de l'URL dans `UniversalPDFViewer`**
2. **Vérifiez que `window.location.origin` est correct**

## 📊 Logs Attendus (Succès)

```
📄 Ouverture PDF (Web): {id: 1, title: "1", file: "hydratation/1.pdf", icon: "water-drop"}
🔗 Chemin PDF construit: /assets/pdfs/hydratation/1.pdf
🔍 Paramètres reçus: {
  pdfUrl: "/assets/pdfs/hydratation/1.pdf",
  pdfTitle: "1",
  pdfFile: "hydratation/1.pdf"
}
📄 Source finale: {uri: "/assets/pdfs/hydratation/1.pdf"}
🌐 Source finale pour viewer: {uri: "http://localhost:3000/assets/pdfs/hydratation/1.pdf"}
📄 Loading PDF via Google Docs Viewer: http://localhost:3000/assets/pdfs/hydratation/1.pdf
```

## 🚨 Logs d'Erreur (Échec)

```
📄 Ouverture PDF (Web): undefined
🔗 Chemin PDF construit: /assets/pdfs/undefined
🔍 Paramètres reçus: {pdfUrl: undefined, ...}
```

## 🎯 Prochaines Étapes

1. **Testez avec le composant de test**
2. **Vérifiez les logs dans la console**
3. **Si le problème persiste, partagez les logs exacts**

---

**Note** : Le composant `PDFTest` est temporaire et sera supprimé une fois le problème résolu.

