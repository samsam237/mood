import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { pdfService } from '../services/pdfService';
import { theme } from '../constants/theme';

const PDFViewerScreen = ({ route }) => {
  const { pdfUrl } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    validatePDF();
  }, [pdfUrl]);

  const validatePDF = async () => {
    if (!pdfUrl) {
      setError('No PDF URL provided');
      setLoading(false);
      return;
    }

    const isValid = await pdfService.validatePDFUrl(pdfUrl);
    if (!isValid) {
      setError('Invalid PDF URL or file not accessible');
      setLoading(false);
    }
  };

  const handleLoadComplete = (numberOfPages, filePath) => {
    setTotalPages(numberOfPages);
    setLoading(false);
    console.log(`PDF loaded: ${numberOfPages} pages`);
  };

  const handlePageChanged = (page, numberOfPages) => {
    setCurrentPage(page);
  };

  const handleError = (error) => {
    console.error('PDF Error:', error);
    setError('Failed to load PDF. Please try again.');
    setLoading(false);
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading PDF...</Text>
        </View>
      )}
      
      <Pdf
        source={{ uri: pdfUrl, cache: true }}
        onLoadComplete={handleLoadComplete}
        onPageChanged={handlePageChanged}
        onError={handleError}
        onLoadProgress={(percent) => {
          console.log(`Loading: ${Math.round(percent * 100)}%`);
        }}
        style={styles.pdf}
        trustAllCerts={false}
        renderActivityIndicator={() => (
          <ActivityIndicator color={theme.colors.primary} size="large" />
        )}
        enablePaging={true}
        enableRTL={false}
        enableAnnotationRendering={true}
        password=""
        spacing={0}
        minScale={1.0}
        maxScale={3.0}
        scale={1.0}
        horizontal={false}
        page={currentPage}
        onScaleChanged={(scale) => {
          console.log('Scale changed:', scale);
        }}
      />
      
      {totalPages > 0 && (
        <View style={styles.pageIndicator}>
          <Text style={styles.pageText}>
            Page {currentPage} of {totalPages}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.overlay,
    zIndex: 1000,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    textAlign: 'center',
    lineHeight: 24,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  pageIndicator: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: theme.colors.overlay,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  pageText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PDFViewerScreen;
