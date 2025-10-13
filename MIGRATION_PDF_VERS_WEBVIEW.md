# Migration de react-native-pdf vers WebView

## 📋 Contexte

`react-native-pdf` v7.0.0 n'est pas compatible avec la nouvelle architecture React Native. 
J'ai temporairement exclu ce module de la compilation pour permettre de générer l'APK.

**Solution** : Utiliser `react-native-webview` qui est déjà installé et compatible.

---

## 🔄 Comment remplacer react-native-pdf par WebView

### Ancienne méthode (react-native-pdf)

```javascript
import Pdf from 'react-native-pdf';

<Pdf
  source={{ uri: pdfPath }}
  onLoadComplete={(numberOfPages) => {
    console.log(`Nombre de pages: ${numberOfPages}`);
  }}
  onError={(error) => {
    console.log(error);
  }}
  style={{ flex: 1 }}
/>
```

### Nouvelle méthode (WebView)

#### Option 1 : PDF en ligne

```javascript
import { WebView } from 'react-native-webview';

<WebView
  source={{ uri: 'https://example.com/document.pdf' }}
  style={{ flex: 1 }}
  onError={(syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error: ', nativeEvent);
  }}
/>
```

#### Option 2 : PDF local

```javascript
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { useState, useEffect } from 'react';

const PDFViewer = ({ pdfPath }) => {
  const [pdfBase64, setPdfBase64] = useState(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        // Lire le PDF en base64
        const base64 = await FileSystem.readAsStringAsync(pdfPath, {
          encoding: FileSystem.EncodingType.Base64
        });
        setPdfBase64(base64);
      } catch (error) {
        console.error('Erreur lors du chargement du PDF:', error);
      }
    };

    loadPDF();
  }, [pdfPath]);

  if (!pdfBase64) {
    return <Text>Chargement du PDF...</Text>;
  }

  return (
    <WebView
      source={{
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { margin: 0; padding: 0; }
                iframe { border: none; width: 100vw; height: 100vh; }
              </style>
            </head>
            <body>
              <iframe src="data:application/pdf;base64,${pdfBase64}"></iframe>
            </body>
          </html>
        `
      }}
      style={{ flex: 1 }}
    />
  );
};
```

#### Option 3 : Avec Google Docs Viewer (recommandé pour Android)

```javascript
import { WebView } from 'react-native-webview';

const PDFViewer = ({ pdfUrl }) => {
  // Encoder l'URL pour Google Docs Viewer
  const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;
  
  return (
    <WebView
      source={{ uri: googleDocsUrl }}
      style={{ flex: 1 }}
      onError={(e) => console.error('Erreur:', e.nativeEvent)}
    />
  );
};
```

---

## 🔍 Trouver et remplacer dans votre code

### 1. Recherchez tous les imports de react-native-pdf

```bash
grep -r "react-native-pdf" src/
```

### 2. Fichiers probablement concernés

D'après la structure de votre projet :
- `src/components/NativePDFViewer.js`
- `src/components/web/WebPDFViewer.js`
- `src/screens/PDFViewerScreen.js`
- `src/screens/PDFViewerScreen.web.js`
- `src/services/pdfService.js`
- `src/utils/pdfViewer.js`

### 3. Exemple de remplacement complet

**Avant (PDFViewerScreen.js) :**
```javascript
import Pdf from 'react-native-pdf';

const PDFViewerScreen = ({ route }) => {
  const { pdfUrl } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <Pdf
        source={{ uri: pdfUrl }}
        style={{ flex: 1 }}
      />
    </View>
  );
};
```

**Après :**
```javascript
import { WebView } from 'react-native-webview';

const PDFViewerScreen = ({ route }) => {
  const { pdfUrl } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: pdfUrl }}
        style={{ flex: 1 }}
        onError={(e) => console.error('Erreur PDF:', e.nativeEvent)}
      />
    </View>
  );
};
```

---

## 📱 Avantages de WebView

✅ **Compatible** avec la nouvelle architecture React Native  
✅ **Déjà installé** dans votre projet  
✅ **Fonctionne** sur Android et iOS  
✅ **Supporte** les PDFs en ligne et locaux  
✅ **Moins de dépendances** natives à maintenir  

---

## ⚠️ Limitations de WebView pour les PDFs

- Pas de fonctionnalités avancées (zoom précis, annotations, etc.)
- L'interface dépend du navigateur système
- Performance légèrement inférieure pour les très gros PDFs

---

## 🔄 Alternative : react-native-view-pdf

Si WebView ne vous convient pas, vous pouvez essayer `react-native-view-pdf` qui supporte la nouvelle architecture :

```bash
npm install react-native-view-pdf
```

```javascript
import PDFView from 'react-native-view-pdf';

<PDFView
  resource={pdfUrl}
  resourceType="url"
  style={{ flex: 1 }}
/>
```

---

## 📝 Checklist de migration

- [ ] Identifier tous les fichiers utilisant react-native-pdf
- [ ] Remplacer les imports par react-native-webview
- [ ] Adapter le code pour WebView
- [ ] Tester l'affichage des PDFs
- [ ] (Optionnel) Supprimer react-native-pdf du package.json

---

## 🆘 Besoin d'aide ?

Si vous avez besoin d'aide pour la migration, voici les fichiers à vérifier :

```bash
# Rechercher tous les fichiers utilisant Pdf ou react-native-pdf
grep -rn "react-native-pdf" src/
grep -rn "from.*pdf" src/
grep -rn "<Pdf" src/
```

La bibliothèque WebView est déjà installée et prête à l'emploi ! 🎉

