import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

/**
 * Viewer PDF avec Google Docs Viewer (fonctionne partout)
 */
const WebPDFViewer = ({ source, onLoadComplete, onError, style }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
    if (onLoadComplete) {
      onLoadComplete(1, source.uri);
    }
  };

  const handleError = (err) => {
    console.error('PDF Error:', err);
    setLoading(false);
    setError(true);
    if (onError) {
      onError(err);
    }
  };

  // Construire l'URL complète du PDF
  let pdfUrl = source.uri;
  
  if (!pdfUrl.startsWith('http')) {
    // Si c'est un chemin local, construire l'URL complète
    if (Platform.OS === 'web') {
      pdfUrl = pdfUrl; // Sur web, le chemin relatif fonctionne
    } else {
      // Sur mobile, utiliser l'adresse du serveur
      pdfUrl = `http://192.168.0.16:8082${pdfUrl}`;
    }
  }

  // Utiliser Google Docs Viewer pour afficher le PDF
  const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;

  console.log('📄 Loading PDF via Google Docs Viewer:', pdfUrl);

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color={theme.colors.error} />
          <Text style={styles.errorText}>Impossible de charger le PDF</Text>
          <Text style={styles.errorSubtext}>
            Vérifiez votre connexion internet
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Chargement du PDF...</Text>
          <Text style={styles.loadingSubtext}>Cela peut prendre quelques secondes</Text>
        </View>
      )}
      
      <WebView
        originWhitelist={['*']}
        source={{ uri: viewerUrl }}
        onLoad={handleLoad}
        onError={handleError}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 1000,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  loadingSubtext: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
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
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default WebPDFViewer;
