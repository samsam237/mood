import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../constants/theme';

// Version web simplifiée du lecteur PDF
const WebPDFViewer = ({ source, onLoadComplete, onError, style, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLoad = () => {
    setLoading(false);
    if (onLoadComplete) {
      onLoadComplete(1, source.uri); // Simuler 1 page
    }
  };

  const handleError = () => {
    setError('PDF non supporté sur le web');
    setLoading(false);
    if (onError) {
      onError('PDF non supporté sur le web');
    }
  };

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.infoText}>
            Le lecteur PDF natif n'est pas disponible sur le web.
          </Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => window.open(source.uri, '_blank')}
          >
            <Text style={styles.buttonText}>Ouvrir dans un nouvel onglet</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement du PDF...</Text>
        </View>
      )}
      <iframe
        src={source.uri}
        style={styles.iframe}
        onLoad={handleLoad}
        onError={handleError}
        title="PDF Viewer"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
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
    fontSize: 18,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
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

export default WebPDFViewer;
