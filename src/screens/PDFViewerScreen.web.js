import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import WebPDFViewer from '../components/web/WebPDFViewer';
import { theme } from '../constants/theme';

const PDFViewerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { pdfUrl } = route.params || {};
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pdfUrl) {
      Alert.alert('Error', 'No PDF URL provided');
      navigation.goBack();
      return;
    }
  }, [pdfUrl, navigation]);

  const handleLoadComplete = (numberOfPages, filePath) => {
    setLoading(false);
    console.log(`PDF loaded: ${numberOfPages} pages`);
  };

  const handleError = (error) => {
    setLoading(false);
    console.error('PDF Error:', error);
  };

  const handleOpenInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  if (!pdfUrl) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No PDF URL provided</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>PDF Viewer</Text>
        <TouchableOpacity
          style={styles.openButton}
          onPress={handleOpenInNewTab}
        >
          <Text style={styles.openButtonText}>Open in New Tab</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.pdfContainer}>
        <WebPDFViewer
          source={{ uri: pdfUrl }}
          onLoadComplete={handleLoadComplete}
          onError={handleError}
          style={styles.pdfViewer}
        />
      </View>
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
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
    textAlign: 'center',
  },
  openButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },
  openButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  pdfContainer: {
    flex: 1,
    margin: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  pdfViewer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.error,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PDFViewerScreen;
