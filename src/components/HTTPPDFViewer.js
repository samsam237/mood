import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

/**
 * Viewer PDF utilisant WebView avec Google Docs Viewer via HTTP
 */
const HTTPPDFViewer = ({ source, onLoadComplete, onError, style }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    preparePDF();
  }, [source]);

  const preparePDF = async () => {
    try {
      console.log('📄 Préparation PDF HTTP:', source);
      
      // Extraire le chemin du fichier depuis l'URI
      let filePath = source?.uri;
      if (!filePath) {
        throw new Error('URI PDF non trouvée');
      }
      
      // Extraire le nom du fichier depuis le chemin
      const match = filePath.match(/\/assets\/pdfs\/(.+)$/);
      if (!match) {
        throw new Error('Format de chemin PDF invalide');
      }
      
      const relativePath = match[1];
      console.log('🔍 Chemin relatif:', relativePath);
      
      // Construire l'URL HTTP du PDF
      // Utiliser l'URL du serveur de développement
      const serverUrl = 'http://192.168.1.153'; // Adresse de votre serveur
      const httpUrl = `${serverUrl}/assets/pdfs/${relativePath}`;
      
      console.log('🌐 URL HTTP construite:', httpUrl);
      
      // Vérifier que le PDF est accessible
      try {
        const response = await fetch(httpUrl, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`PDF non accessible: ${response.status}`);
        }
        console.log('✅ PDF accessible via HTTP');
      } catch (fetchError) {
        console.warn('⚠️ Impossible de vérifier l\'accessibilité:', fetchError.message);
        // Continuer quand même, parfois les serveurs bloquent HEAD
      }
      
      // Utiliser Google Docs Viewer pour afficher le PDF
      const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(httpUrl)}`;
      
      console.log('🔗 URL Google Docs Viewer:', viewerUrl);
      
      setPdfUrl(viewerUrl);
      setLoading(false);
      setError(false);
      
      if (onLoadComplete) {
        onLoadComplete(1, viewerUrl);
      }
      
    } catch (err) {
      console.error('❌ Erreur préparation PDF:', err);
      setError(true);
      setLoading(false);
      if (onError) {
        onError(err);
      }
    }
  };

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    preparePDF();
  };

  const handleOpenInBrowser = () => {
    // Extraire l'URL du PDF depuis l'URL du viewer
    if (pdfUrl) {
      const urlMatch = pdfUrl.match(/url=([^&]+)/);
      if (urlMatch) {
        const pdfDirectUrl = decodeURIComponent(urlMatch[1]);
        console.log('🌐 Ouverture dans navigateur:', pdfDirectUrl);
        // Ici vous pourriez utiliser Linking.openURL(pdfDirectUrl)
        Alert.alert('Info', `URL du PDF: ${pdfDirectUrl}`);
      }
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="picture-as-pdf" size={48} color={theme.colors.primary} />
          <Text style={styles.loadingText}>Chargement du PDF...</Text>
          <Text style={styles.loadingSubtext}>Connexion au serveur</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color={theme.colors.error} />
          <Text style={styles.errorText}>Impossible de charger le PDF</Text>
          <Text style={styles.errorSubtext}>
            Vérifiez votre connexion internet et que le serveur fonctionne
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={handleRetry}
            >
              <MaterialIcons name="refresh" size={20} color="#fff" />
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.browserButton}
              onPress={handleOpenInBrowser}
            >
              <MaterialIcons name="open-in-browser" size={20} color={theme.colors.primary} />
              <Text style={styles.browserButtonText}>Ouvrir dans navigateur</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <WebView
        source={{ uri: pdfUrl }}
        style={styles.webview}
        onLoad={() => {
          console.log('✅ WebView PDF chargé');
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('❌ Erreur WebView:', nativeEvent);
          setError(true);
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.webviewLoading}>
            <MaterialIcons name="picture-as-pdf" size={48} color={theme.colors.primary} />
            <Text style={styles.webviewLoadingText}>Chargement du PDF...</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.error,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  browserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  browserButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  webview: {
    flex: 1,
  },
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  webviewLoadingText: {
    fontSize: 16,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
});

export default HTTPPDFViewer;
