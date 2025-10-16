import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { theme } from '../constants/theme';
import { getMobilePDFAsset } from '../utils/mobilePDFAssets';

/**
 * Viewer PDF simple qui ouvre directement dans l'application
 */
const SimplePDFViewer = ({ source, onLoadComplete, onError, style }) => {
  const openPDF = async () => {
    try {
      console.log('📄 Ouverture PDF simple:', source);
      
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
      
      // Essayer directement avec expo-print (affichage dans l'app)
      try {
        await Print.printAsync({
          uri: pdfAsset,
        });
        console.log('✅ PDF ouvert avec expo-print');
        
        if (onLoadComplete) {
          onLoadComplete(1, pdfAsset);
        }
      } catch (printError) {
        console.log('⚠️ expo-print échoué, essai avec expo-sharing...');
        
        // Fallback: partager l'asset directement
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(pdfAsset, {
            mimeType: 'application/pdf',
            dialogTitle: 'Ouvrir le PDF avec...',
            UTI: 'com.adobe.pdf'
          });
          console.log('✅ PDF partagé avec succès');
        } else {
          throw new Error('Aucune méthode d\'ouverture disponible');
        }
      }
      
    } catch (err) {
      console.error('❌ Erreur ouverture PDF:', err);
      if (onError) {
        onError(err);
      }
      Alert.alert('Erreur', 'Impossible d\'ouvrir le PDF');
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.pdfContainer}>
        <View style={styles.pdfIcon}>
          <MaterialIcons name="picture-as-pdf" size={64} color={theme.colors.primary} />
        </View>
        
        <Text style={styles.pdfTitle}>PDF Disponible</Text>
        <Text style={styles.pdfSubtitle}>Document prêt à être ouvert</Text>
        
        <TouchableOpacity 
          style={styles.openButton}
          onPress={openPDF}
        >
          <MaterialIcons name="open-in-new" size={24} color="#fff" />
          <Text style={styles.openButtonText}>Ouvrir le PDF</Text>
        </TouchableOpacity>
        
        <View style={styles.infoContainer}>
          <MaterialIcons name="info" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.infoText}>
            Le PDF s'ouvrira dans votre application
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  pdfContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  pdfIcon: {
    marginBottom: theme.spacing.lg,
  },
  pdfTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  pdfSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  openButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: theme.spacing.sm,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  infoText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
    textAlign: 'center',
  },
});

export default SimplePDFViewer;
