import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const pdfService = {
  // Valider l'URL du PDF
  async validatePDFUrl(pdfUrl) {
    try {
      if (!pdfUrl) return false;

      // Si c'est un number (asset require), c'est valide
      if (typeof pdfUrl === 'number') {
        return true;
      }

      // Vérifier l'extension pour les strings
      if (typeof pdfUrl === 'string') {
        if (pdfUrl.toLowerCase().endsWith('.pdf')) {
          return true;
        }

        // Vérifier les schémas supportés
        const supportedSchemes = ['http://', 'https://', 'file://'];
        if (supportedSchemes.some(scheme => pdfUrl.startsWith(scheme))) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('❌ Erreur validation PDF:', error);
      return false;
    }
  },

  // Préparer la source PDF
  async preparePDFSource(source) {
    try {
      console.log('🔄 Préparation source PDF:', source);

      let finalUri;
      let type;

      // Cas 1: Asset require direct
      if (typeof source === 'number') {
        finalUri = source;
        type = 'asset';
      }
      // Cas 2: Objet avec URI
      else if (source && source.uri) {
        // Asset number
        if (typeof source.uri === 'number') {
          finalUri = source.uri;
          type = 'asset';
        }
        // URL web
        else if (source.uri.startsWith('http')) {
          finalUri = source.uri;
          type = 'web';
        }
        // Fichier local
        else if (source.uri.startsWith('file://')) {
          finalUri = source.uri;
          type = 'local';
        }
        else {
          throw new Error('Format URI non supporté: ' + source.uri);
        }
      }
      else {
        throw new Error('Format de source PDF non supporté');
      }

      console.log('✅ Source préparée:', { finalUri, type });
      return {
        success: true,
        uri: finalUri,
        type: type
      };
    } catch (error) {
      console.error('❌ Erreur préparation PDF:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Ouvrir un PDF avec expo-print
  async openPDF(uri, options = {}) {
    try {
      console.log('🔄 Ouverture PDF:', uri);

      const result = await Print.printAsync({
        uri: uri,
        ...options
      });

      console.log('✅ PDF ouvert avec succès');
      return {
        success: true,
        result: result
      };
    } catch (error) {
      console.error('❌ Erreur ouverture PDF:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Vérifier si on peut partager un PDF
  async canSharePDF(uri) {
    try {
      // Les assets require ne peuvent pas être partagés
      if (typeof uri === 'number') {
        return false;
      }

      // Les URLs web ne peuvent pas être partagés directement
      if (uri.startsWith('http')) {
        return false;
      }

      // Seuls les fichiers locaux peuvent être partagés
      return await Sharing.isAvailableAsync();
    } catch (error) {
      console.error('❌ Erreur vérification partage:', error);
      return false;
    }
  },

  // Partager un PDF
  async sharePDF(uri) {
    try {
      if (!(await this.canSharePDF(uri))) {
        throw new Error('Ce PDF ne peut pas être partagé');
      }

      await Sharing.shareAsync(uri);
      return {
        success: true
      };
    } catch (error) {
      console.error('❌ Erreur partage PDF:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Obtenir les informations d'un PDF
  async getPDFInfo(pdfUri) {
    try {
      const type = typeof pdfUri === 'number' ? 'asset' : 
                  pdfUri.startsWith('http') ? 'web' : 'local';

      return {
        success: true,
        uri: pdfUri,
        type: type,
        canShare: await this.canSharePDF(pdfUri)
      };
    } catch (error) {
      console.error('❌ Erreur récupération info PDF:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default pdfService;