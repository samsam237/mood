import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DirectPDFViewer from '../components/DirectPDFViewer';
import { theme } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';

const PDFViewerScreen = ({ route }) => {
  const { pdfSource, pdfUrl, pdfTitle = 'Document PDF', pdfFile } = route.params || {};
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // Déterminer la source PDF à utiliser
  const finalSource = pdfSource || { uri: pdfUrl };
  
  console.log('🔍 Paramètres reçus:', { pdfSource, pdfUrl, pdfTitle, pdfFile });
  console.log('📄 Source finale:', finalSource);

  const handleLoadComplete = (numberOfPages, filePath) => {
    console.log(`✅ PDF prêt: ${filePath}`);
    setLoading(false);
    setError(null);
  };

  const handleError = (error) => {
    console.error('❌ PDF Error:', error);
    setError(t('pdf.loadingError'));
    setLoading(false);
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>{pdfTitle}</Text>
          <Text style={styles.subtitle}>{t('pdf.readyToView')}</Text>
        </View>
      </View>

      {/* PDF Viewer Direct */}
      <DirectPDFViewer
        source={finalSource}
        onLoadComplete={handleLoadComplete}
        onError={handleError}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
});

export default PDFViewerScreen;