import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { getMobilePDFAsset } from '../utils/mobilePDFAssets';
import * as FileSystem from 'expo-file-system/legacy';

/**
 * Viewer PDF utilisant WebView avec Google Docs Viewer
 */
const WebViewPDFViewer = ({ source, onLoadComplete, onError, style }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    preparePDF();
  }, [source]);

  const preparePDF = async () => {
    try {
      console.log('📄 Préparation PDF WebView:', source);
      
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
      
      const assetPath = match[1];
      console.log('🔍 Chemin asset:', assetPath);
      
      // Obtenir l'asset
      const pdfAsset = getMobilePDFAsset(assetPath);
      if (!pdfAsset) {
        throw new Error('Asset PDF non trouvé');
      }
      
      console.log('✅ Asset trouvé:', pdfAsset);
      
      // Convertir l'asset en base64
      const base64 = await FileSystem.readAsStringAsync(pdfAsset, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      console.log('✅ Base64 généré, longueur:', base64.length);
      
      // Créer une URL data pour le PDF
      const dataUrl = `data:application/pdf;base64,${base64}`;
      setPdfUrl(dataUrl);
      
      setLoading(false);
      setError(false);
      
      if (onLoadComplete) {
        onLoadComplete(1, dataUrl);
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

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="picture-as-pdf" size={48} color={theme.colors.primary} />
          <Text style={styles.loadingText}>Chargement du PDF...</Text>
          <Text style={styles.loadingSubtext}>Préparation du document</Text>
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
            Le document n'a pas pu être préparé
          </Text>
          
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleRetry}
          >
            <MaterialIcons name="refresh" size={20} color="#fff" />
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
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
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
  },
  retryButtonText: {
    color: '#fff',
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

export default WebViewPDFViewer;
