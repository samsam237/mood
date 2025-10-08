import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import WebPDFViewer from '../components/web/WebPDFViewer';
import { theme } from '../constants/theme';

const PDFViewerScreen = () => {
  const route = useRoute();
  const { pdfUrl } = route.params || {};

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

  return <WebPDFViewer source={{ uri: pdfUrl }} style={{ flex: 1 }} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
