import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import UniversalPDFViewer from '../components/UniversalPDFViewer';
import { theme } from '../constants/theme';

const PDFViewerScreen = () => {
  const route = useRoute();
  const { pdfUrl, pdfTitle, pdfFile } = route.params || {};

  if (!pdfUrl) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color={theme.colors.error} />
          <Text style={styles.errorText}>Aucun PDF spécifié</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec titre dynamique */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>{pdfTitle || 'Document PDF'}</Text>
        <Text style={styles.subtitle}>{pdfFile}</Text>
      </View>
      
      {/* PDF Viewer Universel */}
      <UniversalPDFViewer 
        source={{ uri: pdfUrl }} 
        style={{ flex: 1 }}
        onLoadComplete={() => console.log('PDF chargé:', pdfTitle)}
        onError={(error) => console.error('Erreur PDF:', error)}
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
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
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
});

export default PDFViewerScreen;
