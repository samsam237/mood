import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { theme } from '../constants/theme';
import { getMobilePDFAsset } from '../utils/mobilePDFAssets';

/**
 * Viewer PDF optimisé pour mobile
 */
const MobilePDFViewer = ({ source, onLoadComplete, onError, style }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pdfAsset, setPdfAsset] = useState(null);

  useEffect(() => {
    loadPDF();
  }, [source]);

  const loadPDF = async () => {
    try {
      setLoading(true);
      setError(false);
      
      console.log('📱 Chargement PDF mobile:', source);
      
      // Si c'est déjà un asset require (number)
      if (typeof source === 'number') {
        setPdfAsset(source);
        setLoading(false);
        if (onLoadComplete) {
          onLoadComplete(1, source);
        }
        return;
      }
      
      // Si c'est un objet avec uri
      if (source?.uri) {
        // Extraire le chemin du fichier depuis l'URI
        const filePath = extractFilePath(source.uri);
        console.log('🔍 Chemin extrait:', filePath);
        
        if (filePath) {
          const asset = getMobilePDFAsset(filePath);
          if (asset) {
            setPdfAsset(asset);
            setLoading(false);
            if (onLoadComplete) {
              onLoadComplete(1, asset);
            }
            return;
          }
        }
      }
      
      // Si on arrive ici, le PDF n'a pas pu être chargé
      throw new Error('PDF non trouvé dans les assets mobiles');
      
    } catch (err) {
      console.error('❌ Erreur chargement PDF mobile:', err);
      setError(true);
      setLoading(false);
      if (onError) {
        onError(err);
      }
    }
  };

  const extractFilePath = (uri) => {
    // Extraire le chemin depuis /assets/pdfs/hydratation/1.pdf
    const match = uri.match(/\/assets\/pdfs\/(.+)$/);
    return match ? match[1] : null;
  };

  const openPDF = async () => {
    if (!pdfAsset) {
      Alert.alert('Erreur', 'PDF non disponible');
      return;
    }

    try {
      console.log('📄 Ouverture PDF mobile:', pdfAsset);
      
      // Si c'est un asset require (number)
      if (typeof pdfAsset === 'number') {
        console.log('🔄 Asset require détecté, traitement selon plateforme...');
        
        if (Platform.OS === 'ios') {
          // Sur iOS, utiliser une approche différente
          console.log('🍎 iOS: Utilisation de WebBrowser pour ouvrir le PDF');
          
          try {
            // Essayer d'abord avec expo-print directement
            await Print.printAsync({
              uri: pdfAsset,
            });
            console.log('✅ PDF ouvert avec expo-print sur iOS');
            return;
          } catch (printError) {
            console.log('⚠️ expo-print échoué, essai avec expo-sharing...');
            
            // Fallback: essayer de convertir l'asset en base64 puis créer un fichier
            try {
              const base64 = await FileSystem.readAsStringAsync(pdfAsset, {
                encoding: FileSystem.EncodingType.Base64,
              });
              
              const filename = `temp_pdf_${Date.now()}.pdf`;
              const filePath = `${FileSystem.documentDirectory}${filename}`;
              
              await FileSystem.writeAsStringAsync(filePath, base64, {
                encoding: FileSystem.EncodingType.Base64,
              });
              
              console.log('✅ Asset converti en base64 et sauvegardé:', filePath);
              
              // Partager le fichier créé
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(filePath, {
                  mimeType: 'application/pdf',
                  dialogTitle: 'Ouvrir le PDF avec...',
                  UTI: 'com.adobe.pdf'
                });
                console.log('✅ PDF partagé avec succès sur iOS');
                return;
              }
            } catch (base64Error) {
              console.error('❌ Erreur conversion base64:', base64Error);
              throw base64Error;
            }
          }
        } else {
          // Sur Android, utiliser la copie de fichier
          console.log('🤖 Android: Copie vers répertoire documents');
          
          const filename = `temp_pdf_${Date.now()}.pdf`;
          const filePath = `${FileSystem.documentDirectory}${filename}`;
          
          // Copier l'asset vers le répertoire des documents
          await FileSystem.copyAsync({
            from: pdfAsset,
            to: filePath
          });
          
          console.log('✅ Asset copié vers:', filePath);
          
          // Essayer d'abord avec expo-sharing (plus fiable)
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(filePath, {
              mimeType: 'application/pdf',
              dialogTitle: 'Ouvrir le PDF avec...',
              UTI: 'com.adobe.pdf'
            });
            console.log('✅ PDF partagé avec succès');
            return;
          }
          
          // Fallback: essayer avec expo-print
          await Print.printAsync({
            uri: filePath,
          });
          
          console.log('✅ PDF ouvert avec expo-print');
        }
      } else {
        // Si ce n'est pas un asset require, essayer directement
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(pdfAsset, {
            mimeType: 'application/pdf',
            dialogTitle: 'Ouvrir le PDF avec...',
            UTI: 'com.adobe.pdf'
          });
        } else {
          await Print.printAsync({
            uri: pdfAsset,
          });
        }
        console.log('✅ PDF ouvert avec succès');
      }
      
    } catch (err) {
      console.error('❌ Erreur ouverture PDF:', err);
      Alert.alert(
        'Erreur', 
        'Impossible d\'ouvrir le PDF. Vérifiez qu\'une application PDF est installée sur votre appareil.'
      );
    }
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
            Le document n'est pas disponible sur cet appareil
          </Text>
          
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadPDF}
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
            Le PDF s'ouvrira dans votre application de lecture préférée
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

export default MobilePDFViewer;

