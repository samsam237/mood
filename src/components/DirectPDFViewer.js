import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import { WebView } from 'react-native-webview';
import { theme } from '../constants/theme';
import { getMobilePDFAsset } from '../utils/mobilePDFAssets';
import { useTranslation } from '../hooks/useTranslation';
import CustomAlert from './common/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';

/**
 * Viewer PDF qui ouvre directement avec les applications système
 */
const DirectPDFViewer = ({ source, onLoadComplete, onError, style }) => {
  const { t } = useTranslation();
  const { alert, showError, showSuccess, hideAlert } = useCustomAlert();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pdfAsset, setPdfAsset] = useState(null);
  const [viewMode, setViewMode] = useState('menu'); // 'menu', 'app', 'browser', 'external'
  const [base64Data, setBase64Data] = useState(null);
  const [tempFilePath, setTempFilePath] = useState(null);
  const [conversionComplete, setConversionComplete] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  useEffect(() => {
    loadPDF();
  }, [source]);

  // Debug: tracer les changements de viewMode
  useEffect(() => {
    console.log(`🔄 viewMode changé vers: ${viewMode}`);
  }, [viewMode]);

  // Debug: tracer les changements de base64Data
  useEffect(() => {
    console.log(`🔄 base64Data changé: ${!!base64Data}, longueur: ${base64Data ? base64Data.length : 'N/A'}`);
  }, [base64Data]);

  const loadPDF = async () => {
    try {
      console.log('📄 Chargement PDF direct:', source);
      
      // Extraire le chemin du fichier depuis l'URI
      let filePath = source?.uri;
      if (!filePath) {
        throw new Error(t('pdf.uriNotFound'));
      }
      
      // Extraire le nom du fichier depuis le chemin
      const match = filePath.match(/\/assets\/pdfs\/(.+)$/);
      if (!match) {
        throw new Error(t('pdf.invalidPathFormat'));
      }
      
      const assetPath = match[1];
      console.log('🔍 Chemin asset:', assetPath);
      
      // Obtenir l'asset
      const asset = getMobilePDFAsset(assetPath);
      if (!asset) {
        throw new Error(t('pdf.assetNotFound'));
      }
      
      console.log('✅ Asset trouvé:', asset);
      setPdfAsset(asset);
      
      setLoading(false);
      setError(false);
      
      if (onLoadComplete) {
        onLoadComplete(1, asset);
      }
      
      // Préparer le fichier temporaire pour toutes les options (en arrière-plan)
      try {
        const startTime = Date.now();
        console.log('🔄 Préparation du fichier temporaire...');
        
        // Convertir l'asset en Asset Expo pour obtenir l'URI
        const expoAsset = Asset.fromModule(asset);
        await expoAsset.downloadAsync();
        
        console.log('📁 Asset URI:', expoAsset.localUri || expoAsset.uri);
        
        // Lire le fichier et créer un fichier temporaire
        const base64 = await FileSystem.readAsStringAsync(expoAsset.localUri || expoAsset.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        // Créer un fichier temporaire
        const filename = `pdf_${Date.now()}.pdf`;
        const tempPath = `${FileSystem.documentDirectory}${filename}`;
        
        await FileSystem.writeAsStringAsync(tempPath, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        
        setBase64Data(base64);
        setTempFilePath(tempPath);
        setConversionComplete(true);
        console.log('✅ Fichier temporaire créé:', tempPath);
        console.log('✅ Base64 généré pour navigateur');
        console.log(`⏱️ Durée de conversion: ${duration.toFixed(2)} secondes`);
      } catch (base64Error) {
        console.warn('⚠️ Impossible de préparer le fichier:', base64Error);
        setConversionComplete(true); // Marquer comme terminé même en cas d'erreur
        // On continue quand même, on utilisera les alternatives
      }
      
    } catch (err) {
      console.error('❌ Erreur chargement PDF:', err);
      setError(true);
      setLoading(false);
      if (onError) {
        onError(err);
      }
    }
  };

  const openPDF = async () => {
    if (!pdfAsset) {
      showError(t('common.error'), t('pdf.notAvailable'));
      return;
    }

    // Si la conversion n'est pas encore terminée, afficher un message d'attente
    if (!conversionComplete) {
      console.log('⏳ Conversion pas encore terminée, affichage message d\'attente');
      Alert.alert(
        t('pdf.preparing'),
        t('pdf.pleaseWait'),
        [
          {
            text: t('pdf.wait'),
            style: 'cancel'
          }
        ]
      );
      return;
    }

    console.log('✅ Conversion terminée, affichage des options');

    // Afficher le modal avec les 3 options
    console.log('🎯 Affichage du modal avec 3 options');
    setShowOptionsModal(true);
  };

  const handleOptionSelect = (option) => {
    console.log(`🎯 Option sélectionnée: ${option}`);
    console.log(`🔍 DEBUG - viewMode avant: ${viewMode}`);
    console.log(`🔍 DEBUG - base64Data avant: ${!!base64Data}`);
    setShowOptionsModal(false);
    
    switch (option) {
      case 'app':
        console.log('🔍 DEBUG - Appel openInApp()');
        openInApp();
        break;
      case 'browser':
        openWithBrowser();
        break;
      case 'pdf':
        openWithApps();
        break;
      default:
        console.log('Option non reconnue:', option);
    }
  };

  const openInApp = () => {
    if (base64Data) {
      console.log('📱 Ouverture dans l\'application avec URL data');
      setViewMode('app');
    } else {
      showError(t('common.error'), t('pdf.dataNotAvailableForApp'));
    }
  };

  const openWithBrowser = async () => {
    try {
      console.log('🌐 Ouverture avec navigateur');
      
      // Utiliser uniquement l'URL data pour le navigateur
      if (!base64Data) {
        throw new Error(t('pdf.dataNotAvailable'));
      }
      
      // Créer une URL data pour le navigateur
      const dataUrl = `data:application/pdf;base64,${base64Data}`;
      const pdfSizeMB = (dataUrl.length / (1024 * 1024)).toFixed(2);
      console.log('🔗 URL data créée, longueur:', dataUrl.length);
      console.log(`📊 Taille du PDF: ${pdfSizeMB} MB`);
      
      // Vérifier si l'URL data est trop longue (limite Android ~20MB)
      if (dataUrl.length > 20000000) {
        console.log('⚠️ URL data trop longue pour le navigateur');
        Alert.alert(
          t('pdf.pdfTooLarge'),
          t('pdf.pdfTooLargeMessage'),
          [
            { text: t('common.ok'), style: 'default' }
          ]
        );
        return;
      }
      
      // Utiliser l'URL data
      const canOpen = await Linking.canOpenURL(dataUrl);
      if (canOpen) {
        await Linking.openURL(dataUrl);
        console.log('✅ PDF ouvert avec navigateur via URL data');
      } else {
        throw new Error('Impossible d\'ouvrir avec le navigateur');
      }
      
    } catch (err) {
      console.error('❌ Erreur ouverture navigateur:', err);
      Alert.alert(
        t('pdf.browserError'),
        t('pdf.cannotOpenWithBrowser'),
        [
          { text: t('common.ok'), style: 'default' }
        ]
      );
    }
  };

  const openWithApps = async () => {
    try {
      console.log('📄 Ouverture avec lecteurs PDF');
      
      if (!tempFilePath) {
        throw new Error(t('pdf.tempFileNotAvailable'));
      }
      
      // Utiliser expo-sharing pour ouvrir avec les applications système
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(tempFilePath, {
          mimeType: 'application/pdf',
          dialogTitle: 'Ouvrir le PDF avec...',
          UTI: 'com.adobe.pdf'
        });
        console.log('✅ PDF ouvert avec lecteur externe');
      } else {
        throw new Error('Le partage n\'est pas disponible sur cet appareil');
      }
      
    } catch (err) {
      console.error('❌ Erreur ouverture lecteurs PDF:', err);
      
      // Dernier recours: afficher un message avec instructions
      Alert.alert(
        t('pdf.pdfReady'),
        t('pdf.noAppToOpen'),
        [
          {
            text: t('common.cancel'),
            style: 'cancel'
          },
          {
            text: t('pdf.installAdobeReader'),
            onPress: () => {
              Linking.openURL('https://play.google.com/store/apps/details?id=com.adobe.reader');
            }
          },
          {
            text: t('pdf.googlePdfViewer'),
            onPress: () => {
              Linking.openURL('https://play.google.com/store/apps/details?id=com.google.android.apps.pdfviewer');
            }
          }
        ]
      );
    }
  };

  const retryLoad = () => {
    setError(false);
    setLoading(true);
    loadPDF();
  };

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="picture-as-pdf" size={48} color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t('pdf.loading')}</Text>
          <Text style={styles.loadingSubtext}>{t('pdf.preparingDocument')}</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color={theme.colors.error} />
          <Text style={styles.errorText}>{t('pdf.cannotLoad')}</Text>
          <Text style={styles.errorSubtext}>
            {t('pdf.documentNotPrepared')}
          </Text>
          
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={retryLoad}
          >
            <MaterialIcons name="refresh" size={20} color="#fff" />
            <Text style={styles.retryButtonText}>{t('pdf.retry')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Si on est en mode affichage dans l'app et qu'on a les données
  if (viewMode === 'app' && base64Data) {
    // Créer une URL data pour le WebView
    const dataUrl = `data:application/pdf;base64,${base64Data}`;
    console.log('🔍 RENDER - Mode app détecté, création WebView...');
    console.log('🔍 RENDER - base64Data disponible:', !!base64Data);
    console.log('🔍 RENDER - Longueur base64:', base64Data.length);
    console.log('🔍 RENDER - Longueur URL data:', dataUrl.length);
    console.log('🔍 RENDER - URL data créée (premiers 100 chars):', dataUrl.substring(0, 100));
    
    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {
            console.log('🔙 Retour vers menu depuis header');
            setViewMode('menu');
          }} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary} />
            <Text style={styles.backButtonText}>{t('pdf.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('pdf.pdfInApp')}</Text>
        </View>
        
        <WebView
          source={{ uri: dataUrl }}
          style={{ flex: 1 }}
          onLoad={() => console.log('✅ PDF chargé dans WebView avec URL data')}
          onError={(error) => {
            console.error('❌ Erreur WebView PDF:', error);
            console.error('❌ Détails erreur:', JSON.stringify(error, null, 2));
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          onLoadStart={() => console.log('🔄 WebView commence le chargement...')}
          onLoadEnd={() => console.log('🏁 WebView a terminé le chargement')}
          onNavigationStateChange={(navState) => {
            console.log('🧭 WebView navigation change:', {
              url: navState.url?.substring(0, 100) + '...',
              loading: navState.loading,
              canGoBack: navState.canGoBack,
              canGoForward: navState.canGoForward
            });
          }}
          onMessage={(event) => {
            console.log('💬 WebView message reçu:', event.nativeEvent.data);
          }}
          onShouldStartLoadWithRequest={(request) => {
            console.log('🌐 WebView should start load:', request.url?.substring(0, 100) + '...');
            return true;
          }}
        />
      </View>
    );
  }

  // Mode menu par défaut
  return (
    <View style={[styles.container, style]}>
      <View style={styles.pdfContainer}>
        <View style={styles.pdfIcon}>
          <MaterialIcons name="picture-as-pdf" size={64} color={theme.colors.primary} />
        </View>
        
        <Text style={styles.pdfTitle}>{t('pdf.pdfAvailable')}</Text>
        <Text style={styles.pdfSubtitle}>
          {!conversionComplete ? t('pdf.preparingDocumentDots') : t('pdf.documentReady')}
        </Text>
        
        {!conversionComplete && (
          <View style={styles.conversionIndicator}>
            <MaterialIcons name="hourglass-empty" size={20} color={theme.colors.primary} />
            <Text style={styles.conversionText}>{t('pdf.conversionInProgress')}</Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.openButton}
          onPress={openPDF}
        >
          <MaterialIcons name="open-in-new" size={24} color="#fff" />
          <Text style={styles.openButtonText}>{t('pdf.openPdf')}</Text>
        </TouchableOpacity>
        
        <View style={styles.infoContainer}>
          <MaterialIcons name="info" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.infoText}>
            {!conversionComplete ? t('pdf.preparationInProgress') : t('pdf.threeOptionsAvailable')}
          </Text>
        </View>
        

      </View>

      {/* Modal pour les options d'ouverture */}
      <Modal
        visible={showOptionsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('pdf.howToOpen')}</Text>
            <Text style={styles.modalSubtitle}>{t('pdf.chooseYourMethod')}</Text>
            
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={() => handleOptionSelect('app')}
            >
              <MaterialIcons name="phone-android" size={24} color={theme.colors.primary} />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>{t('pdf.inApplication')}</Text>
                <Text style={styles.optionSubtitle}>{t('pdf.quickReliable')}</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={() => handleOptionSelect('browser')}
            >
              <MaterialIcons name="language" size={24} color={theme.colors.primary} />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>{t('pdf.browser')}</Text>
                <Text style={styles.optionSubtitle}>{t('pdf.pdfsUpTo20MB')}</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={() => handleOptionSelect('pdf')}
            >
              <MaterialIcons name="picture-as-pdf" size={24} color={theme.colors.primary} />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>{t('pdf.pdfReader')}</Text>
                <Text style={styles.optionSubtitle}>{t('pdf.advancedFeatures')}</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowOptionsModal(false)}
            >
              <Text style={styles.cancelButtonText}>{t('pdf.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginRight: 80, // Pour centrer avec le bouton retour
  },
  conversionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.primaryLight || '#E3F2FD',
    borderRadius: 20,
  },
  conversionText: {
    marginLeft: 8,
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.surface || '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border || '#E0E0E0',
  },
  optionTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '500',
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
    marginBottom: theme.spacing.lg,
  },
  infoText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  tipsText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
});

export default DirectPDFViewer;
