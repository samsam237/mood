import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import Constants from 'expo-constants';

/**
 * Obtenir l'URL du serveur Expo automatiquement
 */
const getServerUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri?.split(':').shift();
  const port = 8082;
  return debuggerHost ? `http://${debuggerHost}:${port}` : 'http://localhost:8082';
};

/**
 * Ouvre un PDF avec le lecteur natif du téléphone
 * API Legacy stable et testée
 */
export const openPDF = async (pdfPath, onProgress) => {
  try {
    // Sur web : retourner l'URL directe
    if (Platform.OS === 'web') {
      return pdfPath;
    }

    // Sur mobile : télécharger puis partager
    const serverUrl = getServerUrl();
    const fullUrl = `${serverUrl}${pdfPath}`;

    console.log('📥 Downloading PDF from:', fullUrl);

    // Nom de fichier propre (sans espaces ni caractères spéciaux)
    const filename = pdfPath.split('/').pop().replace(/\s+/g, '_');
    // FileSystem.documentDirectory est déjà une string avec l'API legacy
    const fileUri = FileSystem.documentDirectory + filename;

    console.log('📁 Saving to:', fileUri);

    // Vérifier si déjà en cache
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    
    if (!fileInfo.exists) {
      if (onProgress) onProgress(20);
      
      // Télécharger le PDF
      const downloadResult = await FileSystem.downloadAsync(fullUrl, fileUri);
      
      if (onProgress) onProgress(100);
      console.log('✅ Download complete:', downloadResult.uri);
    } else {
      console.log('📦 PDF already cached');
      if (onProgress) onProgress(100);
    }

    // Vérifier si le partage est disponible
    if (!(await Sharing.isAvailableAsync())) {
      throw new Error('Le partage n\'est pas disponible sur cet appareil');
    }

    // Ouvrir avec le lecteur natif
    console.log('📖 Opening with native PDF viewer...');
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Ouvrir le PDF avec...',
      UTI: 'com.adobe.pdf'
    });

    console.log('✅ PDF opened successfully');
    return { success: true };

  } catch (error) {
    console.error('❌ Error opening PDF:', error);
    
    let errorMessage = 'Impossible d\'ouvrir le PDF';
    
    if (error.message?.includes('Network') || error.message?.includes('fetch')) {
      errorMessage = 'Erreur réseau. Vérifiez votre connexion WiFi (même réseau que l\'ordinateur).';
    } else if (error.message?.includes('404')) {
      errorMessage = 'PDF non trouvé. Le serveur web doit être lancé (npm run web).';
    } else {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Nettoyer le cache des PDFs
 */
export const clearPDFCache = async () => {
  try {
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    
    let deleted = 0;
    for (const file of pdfFiles) {
      await FileSystem.deleteAsync(FileSystem.documentDirectory + file, { idempotent: true });
      deleted++;
    }
    
    console.log(`🧹 Cleared ${deleted} PDFs from cache`);
    return { success: true, count: deleted };
  } catch (error) {
    console.error('Error clearing cache:', error);
    return { success: false, error: error.message };
  }
};
