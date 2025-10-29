import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import { theme } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';
import { getMobilePDFAsset } from '../utils/mobilePDFAssets';

const NativePDFViewer = ({ source, onLoadComplete, onError, style }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfPath, setPdfPath] = useState(null);

  useEffect(() => {
    loadAndPreparePDF();
  }, [source]);

  const loadAndPreparePDF = async () => {
    try {
      setLoading(true);
      setError(null);
      setPdfPath(null);

      let finalAsset;
      let filePath;

      // Déterminer l'asset basé sur la structure de la source
      if (typeof source === 'number') {
        finalAsset = source;
        filePath = `asset-${source}.pdf`;
      } else if (source?.uri) {
        const match = source.uri.match(/\/assets\/pdfs\/(.+)$/);
        if (match) {
          filePath = match[1];
          finalAsset = getMobilePDFAsset(filePath);
        } else {
          // Si c'est une URI directe (ex: depuis le web), l'utiliser directement
          setPdfPath(source.uri);
          setLoading(false);
          if (onLoadComplete) onLoadComplete(1, source.uri);
          return;
        }
      }

      if (!finalAsset) {
        throw new Error(t('pdf.assetNotFound'));
      }

      const expoAsset = Asset.fromModule(finalAsset);
      await expoAsset.downloadAsync();

      if (!expoAsset.localUri) {
        throw new Error(t('pdf.tempFileNotAvailable'));
      }

      // Copier le fichier vers le répertoire de documents pour le partage
      const filename = `pdf_${Date.now()}.pdf`;
      const documentPath = `${FileSystem.documentDirectory}${filename}`;
      
      await FileSystem.copyAsync({
        from: expoAsset.localUri,
        to: documentPath
      });

      console.log('✅ PDF copié vers:', documentPath);
      setPdfPath(documentPath);
      setLoading(false);
      if (onLoadComplete) onLoadComplete(1, documentPath);

    } catch (err) {
      console.error('❌ NativePDFViewer Error:', err);
      setError(t('pdf.loadingError'));
      setLoading(false);
      if (onError) onError(err);
    }
  };

  const openWithNativeApp = async () => {
    if (!pdfPath) {
      Alert.alert(t('pdf.error'), t('pdf.noPdfToDisplay'));
      return;
    }

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(t('pdf.error'), t('pdf.sharingNotAvailable'));
        return;
      }

      await Sharing.shareAsync(pdfPath, {
        mimeType: 'application/pdf',
        dialogTitle: t('pdf.openWith'),
      });
    } catch (err) {
      console.error('❌ Erreur partage PDF:', err);
      Alert.alert(t('pdf.error'), t('pdf.sharingError'));
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, style, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>{t('pdf.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, style, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!pdfPath) {
    return (
      <View style={[styles.container, style, styles.centered]}>
        <Text style={styles.errorText}>{t('pdf.noPdfToDisplay')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style, styles.centered]}>
      <Text style={styles.successText}>✅ {t('pdf.loadedSuccessfully')}</Text>
      <Text style={styles.infoText}>{t('pdf.clickToOpen')}</Text>
      <View style={styles.buttonContainer}>
        <Text 
          style={styles.openButton}
          onPress={openWithNativeApp}
        >
          {t('pdf.openWithNativeApp')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
  },
  errorText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.error,
    textAlign: 'center',
  },
  successText: {
    fontSize: 18,
    color: theme.colors.success,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  infoText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  buttonContainer: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  openButton: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NativePDFViewer;