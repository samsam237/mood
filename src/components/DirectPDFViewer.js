import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import { theme } from '../constants/theme';
import { getMobilePDFAsset } from '../utils/mobilePDFAssets';
import { useTranslation } from '../hooks/useTranslation';
import CustomAlert from './common/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';

/**
 * Viewer PDF simplifié - ouverture uniquement via lecteur PDF externe
 */
const DirectPDFViewer = ({ source, onLoadComplete, onError, style }) => {
  const { t } = useTranslation();
  const { alert, showError, showSuccess, hideAlert } = useCustomAlert();
  const [loading, setLoading] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [pdfPath, setPdfPath] = useState(null);

  useEffect(() => {
    loadPDF();
  }, [source]);

  const loadPDF = async () => {
    try {
      setLoading(true);
      setPdfReady(false);
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
          throw new Error(t('pdf.assetNotFound'));
        }
      }

      if (!finalAsset) {
        throw new Error(t('pdf.assetNotFound'));
      }

      console.log('✅ Asset PDF trouvé:', finalAsset);

      // Charger l'asset directement
      const expoAsset = Asset.fromModule(finalAsset);
      await expoAsset.downloadAsync();

      if (!expoAsset.localUri) {
        throw new Error(t('pdf.tempFileNotAvailable'));
      }

      console.log('✅ PDF chargé:', expoAsset.localUri);

      // Copier le PDF vers le répertoire de documents pour le partage
      const filename = `pdf_${Date.now()}.pdf`;
      const documentPath = `${FileSystem.documentDirectory}${filename}`;
      
      await FileSystem.copyAsync({
        from: expoAsset.localUri,
        to: documentPath
      });

      console.log('✅ PDF copié vers:', documentPath);
      setPdfPath(documentPath);
      setPdfReady(true);
      setLoading(false);
      
      if (onLoadComplete) {
        onLoadComplete(1, documentPath);
      }

    } catch (err) {
      console.error('❌ DirectPDFViewer Error:', err);
      setLoading(false);
      if (onError) onError(err);
    }
  };

  const openWithPDFReader = async () => {
    if (!pdfPath) {
      showError(t('pdf.noPdfToDisplay'));
      return;
    }

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        showError(t('pdf.sharingNotAvailable'));
        return;
      }

      await Sharing.shareAsync(pdfPath, {
        mimeType: 'application/pdf',
        dialogTitle: t('pdf.openWith'),
      });
    } catch (err) {
      console.error('❌ Erreur partage PDF:', err);
      showError(t('pdf.sharingError'));
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, style, styles.centered]}>
        <Text style={styles.loadingText}>{t('pdf.loading')}</Text>
      </View>
    );
  }

  if (!pdfReady || !pdfPath) {
    return (
      <View style={[styles.container, style, styles.centered]}>
        <Text style={styles.errorText}>{t('pdf.noPdfToDisplay')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.openButton}
          onPress={openWithPDFReader}
        >
          <MaterialIcons name="open-in-new" size={24} color={theme.colors.white} />
          <Text style={styles.openButtonText}>Ouvrir avec un lecteur PDF</Text>
        </TouchableOpacity>
      </View>
      
      {alert.visible && (
        <CustomAlert
          visible={alert.visible}
          title={alert.title}
          message={alert.message}
          type={alert.type}
          onClose={hideAlert}
        />
      )}
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
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  openButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  openButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: theme.spacing.sm,
  },
});

export default DirectPDFViewer;