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
import UniversalPDFViewer from '../components/UniversalPDFViewer';
import { theme } from '../constants/theme';

const PDFViewerScreen = ({ route }) => {
  const { pdfSource, pdfUrl, pdfTitle = 'Document PDF', pdfFile } = route.params || {};
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
    setError('Impossible de charger le PDF. Veuillez réessayer.');
    setLoading(false);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹ Retour</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{pdfTitle}</Text>
          <Text style={styles.subtitle}>Prêt à visualiser</Text>
        </View>
        
        <View style={styles.placeholder} />
      </View>

      {/* PDF Viewer Universel */}
      <UniversalPDFViewer
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
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
  },
  placeholder: {
    width: 60,
  },
});

export default PDFViewerScreen;